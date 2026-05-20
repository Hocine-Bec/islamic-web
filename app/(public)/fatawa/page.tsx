import { getPublishedFatawa, getAllFatawaCategories } from "@/lib/queries/fatawa";
import FatawaGrid from "@/components/public/FatawaGrid";
export const dynamic = "force-dynamic";

export default async function FatawaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [fatawa, categories] = await Promise.all([
    getPublishedFatawa(),
    getAllFatawaCategories(),
  ]);

  return <FatawaGrid fatawa={fatawa} categories={categories} initialCategory={category || null} />;
}
