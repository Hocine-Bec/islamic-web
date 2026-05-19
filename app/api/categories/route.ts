import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllCategories, createCategory } from "@/lib/queries/categories";
import slugify from "slugify";

export async function GET() {
  const data = await getAllCategories();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description } = await req.json();
  const slug = slugify(name, { lower: true, strict: true });
  const category = await createCategory({ name, slug, description });
  return NextResponse.json(category);
}
