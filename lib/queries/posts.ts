import { db } from "@/lib/db";
import { posts, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllPosts() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      createdAt: posts.createdAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.createdAt));
}

export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return post;
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId?: number;
  status: "draft" | "published";
}) {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
}

export async function updatePost(
  id: number,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    categoryId?: number;
    status?: "draft" | "published";
    updatedAt?: string;
  }
) {
  const [post] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(posts.id, id))
    .returning();
  return post;
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id));
}

export async function getPublishedPosts() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      createdAt: posts.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.createdAt));
}

export async function getPublishedPostBySlug(slug: string) {
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      createdAt: posts.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.slug, slug))
    .limit(1);
  return post;
}

export async function getPostsByCategory(categoryId: number) {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      createdAt: posts.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.categoryId, categoryId))
    .orderBy(desc(posts.createdAt));
}

export async function getPublishedPostsWithContent() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      createdAt: posts.createdAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.createdAt));
}