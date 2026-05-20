import { db } from "@/lib/db";
import { fatawa, fatawaCategories, fatawaAudio } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// ─── Categories ───────────────────────────────────────────────
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

// ─── Fatawa ───────────────────────────────────────────────────
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

export async function getPublishedFatawa() {
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
    .where(eq(fatawa.status, "published"))
    .orderBy(desc(fatawa.createdAt));
}

export async function getFatawaBySlug(slug: string) {
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
}

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
    categoryId?: number;
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

// ─── Fatawa Audio ─────────────────────────────────────────────
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