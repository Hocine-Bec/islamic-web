import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFatawaCategories, createFatawaCategory } from "@/lib/queries/fatawa";

export async function GET() {
  const data = await getAllFatawaCategories();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();
  const slug = `category-${Date.now().toString(36)}`;
  const cat = await createFatawaCategory({ name, slug, description });
  return NextResponse.json(cat);
}