import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.createdAt);
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return category;
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const [category] = await db.insert(categories).values(data).returning();
  return category;
}

export async function updateCategory(
  id: number,
  data: { name?: string; slug?: string; description?: string }
) {
  const [category] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();
  return category;
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
}
