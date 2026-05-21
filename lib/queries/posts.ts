import { db } from "@/lib/db";
import { posts, categories } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const PAGE_SIZE = 12;

// ─── Admin (no cache for write/admin operations) ──────────────
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

// ─── Public list (Cached) ─────────────────────────────────────
export const getPublishedPostsLight = (page = 1, categorySlug?: string) =>
  unstable_cache(
    async () => {
      const offset = (page - 1) * PAGE_SIZE;
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
        .where(
          categorySlug
            ? sql`${posts.status} = 'published' AND ${categories.slug} = ${categorySlug}`
            : eq(posts.status, "published")
        )
        .orderBy(desc(posts.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset);
    },
    [`posts-light-p${page}-c${categorySlug ?? "all"}`],
    { revalidate: 3600, tags: ["posts"] }
  )();

// ─── Count (Cached) ───────────────────────────────────────────
export const getPublishedPostsCount = (categorySlug?: string) =>
  unstable_cache(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(
          categorySlug
            ? sql`${posts.status} = 'published' AND ${categories.slug} = ${categorySlug}`
            : eq(posts.status, "published")
        );
      return result[0].count;
    },
    [`posts-count-${categorySlug ?? "all"}`],
    { revalidate: 3600, tags: ["posts"] }
  )();

// ─── Single post (Cached) ─────────────────────────────────────
export const getPublishedPostBySlug = (slug: string) =>
  unstable_cache(
    async () => {
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
    },
    [`post-${slug}`],
    { revalidate: 3600, tags: ["posts", `post-${slug}`] }
  )();

// ─── Homepage (Cached) ────────────────────────────────────────
export const getLatestPosts = (limit = 6) =>
  unstable_cache(
    async () => {
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
        .orderBy(desc(posts.createdAt))
        .limit(limit);
    },
    [`latest-posts-${limit}`],
    { revalidate: 3600, tags: ["posts"] }
  )();

// ─── Stats count only (Cached) ────────────────────────────────
export const getPostsCount = () =>
  unstable_cache(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.status, "published"));
      return result[0].count;
    },
    ["posts-total-count"],
    { revalidate: 3600, tags: ["posts"] }
  )();

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
    categoryId?: number | null;
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

export async function getPublishedPosts() {
  return getPublishedPostsLight();
}