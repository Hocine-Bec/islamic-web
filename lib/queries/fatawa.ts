import { db } from "@/lib/db";
import { fatawa, fatawaCategories, fatawaAudio } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const PAGE_SIZE = 12;

export async function getAllFatawaCategories() {
  return db.select().from(fatawaCategories).orderBy(fatawaCategories.createdAt);
}

export async function createFatawaCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const [cat] = await db.insert(fatawaCategories).values(data).returning();
  return cat;
}

export async function deleteFatawaCategory(id: number) {
  await db.delete(fatawaCategories).where(eq(fatawaCategories.id, id));
}

// ─── Full list for admin (No Cache) ──────────────────────────
export async function getAllFatawa() {
  return db
    .select({
      id: fatawa.id,
      slug: fatawa.slug,
      question: fatawa.question,
      questionerName: fatawa.questionerName,
      isAnonymous: fatawa.isAnonymous,
      status: fatawa.status,
      createdAt: fatawa.createdAt,
      categoryName: fatawaCategories.name,
      categorySlug: fatawaCategories.slug,
    })
    .from(fatawa)
    .leftJoin(fatawaCategories, eq(fatawa.categoryId, fatawaCategories.id))
    .orderBy(desc(fatawa.createdAt));
}

// ─── Light list for public (Cached) ──────────────────────────
export const getPublishedFatawaLight = (page = 1, categorySlug?: string) =>
  unstable_cache(
    async () => {
      const offset = (page - 1) * PAGE_SIZE;

      return db
        .select({
          id: fatawa.id,
          slug: fatawa.slug,
          question: fatawa.question,
          questionerName: fatawa.questionerName,
          isAnonymous: fatawa.isAnonymous,
          createdAt: fatawa.createdAt,
          categoryName: fatawaCategories.name,
          categorySlug: fatawaCategories.slug,
        })
        .from(fatawa)
        .leftJoin(fatawaCategories, eq(fatawa.categoryId, fatawaCategories.id))
        .where(
          categorySlug
            ? sql`${fatawa.status} = 'published' AND ${fatawaCategories.slug} = ${categorySlug}`
            : eq(fatawa.status, "published")
        )
        .orderBy(desc(fatawa.createdAt))
        .limit(PAGE_SIZE)
        .offset(offset);
    },
    [`fatawa-light-p${page}-c${categorySlug ?? "all"}`],
    { revalidate: 3600, tags: ["fatawa"] }
  )();

// ─── Count (Cached) ───────────────────────────────────────────
export const getPublishedFatawaCount = (categorySlug?: string) =>
  unstable_cache(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(fatawa)
        .leftJoin(fatawaCategories, eq(fatawa.categoryId, fatawaCategories.id))
        .where(
          categorySlug
            ? sql`${fatawa.status} = 'published' AND ${fatawaCategories.slug} = ${categorySlug}`
            : eq(fatawa.status, "published")
        );
      return result[0].count;
    },
    [`fatawa-published-count-${categorySlug ?? "all"}`],
    { revalidate: 3600, tags: ["fatawa"] }
  )();

// ─── Stats count only (Cached) ────────────────────────────────
export const getFatawaCount = () =>
  unstable_cache(
    async () => {
      const result = await db
        .select({ count: count() })
        .from(fatawa)
        .where(eq(fatawa.status, "pending"));
      return result[0].count;
    },
    ["fatawa-pending-count"],
    { revalidate: 3600, tags: ["fatawa"] }
  )();

// ─── Single fatwa (Cached) ────────────────────────────────────
export const getFatawaBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const [f] = await db
        .select({
          id: fatawa.id,
          slug: fatawa.slug,
          question: fatawa.question,
          answer: fatawa.answer,
          questionerName: fatawa.questionerName,
          isAnonymous: fatawa.isAnonymous,
          status: fatawa.status,
          createdAt: fatawa.createdAt,
          updatedAt: fatawa.updatedAt,
          categoryName: fatawaCategories.name,
          categorySlug: fatawaCategories.slug,
        })
        .from(fatawa)
        .leftJoin(fatawaCategories, eq(fatawa.categoryId, fatawaCategories.id))
        .where(eq(fatawa.slug, slug))
        .limit(1);
      return f;
    },
    [`fatwa-${slug}`],
    { revalidate: 3600, tags: ["fatawa", `fatwa-${slug}`] }
  )();

export async function getFatawaById(id: number) {
  const [f] = await db
    .select()
    .from(fatawa)
    .where(eq(fatawa.id, id))
    .limit(1);
  return f;
}

export async function createFatwa(data: {
  slug: string;
  question: string;
  answer?: string;
  questionerName?: string;
  isAnonymous?: boolean;
  categoryId?: number;
  status?: "pending" | "published";
}) {
  const [f] = await db.insert(fatawa).values(data).returning();
  return f;
}

export async function updateFatwa(
  id: number,
  data: {
    question?: string;
    answer?: string;
    questionerName?: string;
    isAnonymous?: boolean;
    categoryId?: number | null;
    status?: "pending" | "published";
    updatedAt?: string;
  }
) {
  const [f] = await db
    .update(fatawa)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(fatawa.id, id))
    .returning();
  return f;
}

export async function deleteFatwa(id: number) {
  await db.delete(fatawa).where(eq(fatawa.id, id));
}

export async function getAudioByFatwa(fatawaId: number) {
  return db
    .select()
    .from(fatawaAudio)
    .where(eq(fatawaAudio.fatawaId, fatawaId))
    .orderBy(fatawaAudio.order);
}

export async function createFatawaAudio(data: {
  fatawaId: number;
  title: string;
  url: string;
  order: number;
}) {
  const [audio] = await db.insert(fatawaAudio).values(data).returning();
  return audio;
}

export async function deleteFatawaAudio(id: number) {
  await db.delete(fatawaAudio).where(eq(fatawaAudio.id, id));
}