import { getPublishedFatawaLight, getPublishedFatawaCount } from "@/lib/queries/fatawa";
import { getAllFatawaCategories } from "@/lib/queries/fatawa";
import FatawaGrid from "@/components/public/FatawaGrid";

export default async function FatawaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const currentPage = Number(page ?? 1);

  const [fatawa, totalCount, categories] = await Promise.all([
    getPublishedFatawaLight(currentPage, category),
    getPublishedFatawaCount(),
    getAllFatawaCategories(),
  ]);

  return (
    <FatawaGrid
      fatawa={fatawa}
      categories={categories}
      totalCount={totalCount}
      currentPage={currentPage}
      activeCategory={category}
    />
  );
}