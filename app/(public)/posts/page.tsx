import { getPublishedPostsWithContent } from "@/lib/queries/posts";
import { getAllCategories } from "@/lib/queries/categories";
import PostsGrid from "@/components/public/PostsGrid";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [posts, categories] = await Promise.all([
    getPublishedPostsWithContent(),
    getAllCategories(),
  ]);

  return <PostsGrid posts={posts} categories={categories} initialCategory={category || null} />;
}