import { NextRequest, NextResponse } from "next/server";
import { getApprovedCommentsByPost, createComment } from "@/lib/queries/comments";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const data = await getApprovedCommentsByPost(Number(postId));
  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const { authorName, content } = await req.json();

  if (!authorName?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const comment = await createComment({
    postId: Number(postId),
    authorName,
    content,
  });

  return NextResponse.json(comment);
}
