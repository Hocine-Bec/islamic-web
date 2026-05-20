import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updatePost, deletePost } from "@/lib/queries/posts";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .limit(1);

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const post = await updatePost(Number(id), data);
  return NextResponse.json(post);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deletePost(Number(id));
  return NextResponse.json({ success: true });
}
