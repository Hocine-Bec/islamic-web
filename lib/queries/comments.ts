import { db } from "@/lib/db";
import { comments, posts } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export async function getAllComments() {
  return db
    .select({
      id: comments.id,
      authorName: comments.authorName,
      content: comments.content,
      approved: comments.approved,
      createdAt: comments.createdAt,
      postTitle: posts.title,
      postSlug: posts.slug,
    })
    .from(comments)
    .leftJoin(posts, eq(comments.postId, posts.id))
    .orderBy(desc(comments.createdAt));
}

export async function getCommentsCount() {
  const result = await db.select({ count: count() }).from(comments);
  return result[0].count;
}

export async function approveComment(id: number) {
  await db.update(comments).set({ approved: true }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  await db.delete(comments).where(eq(comments.id, id));
}

export async function getApprovedCommentsByPost(postId: number) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: {
  postId: number;
  authorName: string;
  content: string;
}) {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
}
