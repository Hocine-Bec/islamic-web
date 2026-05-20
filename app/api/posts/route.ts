import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllPosts, createPost } from "@/lib/queries/posts";
import slugify from "slugify";

export async function GET() {
  const data = await getAllPosts();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, excerpt, categoryId, status } = await req.json();
  const slug = slugify(title, { lower: true, strict: true });
  const post = await createPost({ title, slug, content, excerpt, categoryId, status });
  return NextResponse.json(post);
}
