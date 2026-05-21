import { getPublishedPostsLight, getPublishedPostsCount } from "@/lib/queries/posts";
import { getAllCategories } from "@/lib/queries/categories";
import PostsGrid from "@/components/public/PostsGrid";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const currentPage = Number(page ?? 1);

  const [posts, totalCount, categories] = await Promise.all([
    getPublishedPostsLight(currentPage, category),
    getPublishedPostsCount(category),
    getAllCategories(),
  ]);

  return (
    <PostsGrid
      posts={posts}
      categories={categories}
      totalCount={totalCount}
      currentPage={currentPage}
      activeCategory={category}
    />
  );
}