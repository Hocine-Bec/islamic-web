"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getCategoryColor } from "@/lib/categoryColors";
import { formatArabicDate } from "@/lib/utils";
import { Search } from "lucide-react";

const PAGE_SIZE = 12;

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function PostsGrid({
  posts,
  categories,
  totalCount,
  currentPage,
  activeCategory,
}: {
  posts: Post[];
  categories: Category[];
  totalCount: number;
  currentPage: number;
  activeCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function navigate(params: { page?: number; category?: string }) {
    const p = new URLSearchParams();
    if (params.category) p.set("category", params.category);
    if (params.page && params.page > 1) p.set("page", String(params.page));
    startTransition(() => {
      router.push(`${pathname}?${p.toString()}`);
    });
  }

  // Client-side search filters the current page only
  const filtered = search.trim()
    ? posts.filter(
      (p) =>
        p.title.includes(search) || p.excerpt?.includes(search)
    )
    : posts;

  return (
    <>
      {/* Filter bar */}
      <div className={`bg-white border-b border-gray-100 sticky top-16 z-40 transition-opacity ${isPending ? "opacity-60" : ""}`}>
        <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الدروس..."
              className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 text-xs">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate({ page: 1 })}
              className={`text-xs px-4 py-1.5 rounded-full border transition ${!activeCategory
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate({ category: cat.slug, page: 1 })}
                className={`text-xs px-4 py-1.5 rounded-full border transition ${activeCategory === cat.slug
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-0.5 h-4 bg-green-700 rounded-full" />
          <h1 className="text-sm font-medium text-gray-800">الدروس والمحاضرات</h1>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {totalCount} درس
        </span>
      </div>

      {/* Posts grid */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">لا توجد نتائج</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {filtered.map((post) => {
                const color = getCategoryColor(post.categorySlug);
                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition block group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      {post.categoryName ? (
                        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
                          {post.categoryName}
                        </span>
                      ) : <span />}
                      <span className="text-[10px] text-gray-300">
                        {formatArabicDate(post.createdAt)}
                      </span>
                    </div>
                    <h2 className="text-sm font-medium text-gray-800 leading-relaxed mb-2 group-hover:text-green-800 transition line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-xs text-green-700 group-hover:underline">
                        اقرأ الدرس ←
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => navigate({ page: currentPage - 1, category: activeCategory })}
                  disabled={currentPage <= 1 || isPending}
                  className="text-xs px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-700 disabled:opacity-30 transition"
                >
                  → السابق
                </button>
                <span className="text-xs text-gray-400 px-3">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => navigate({ page: currentPage + 1, category: activeCategory })}
                  disabled={currentPage >= totalPages || isPending}
                  className="text-xs px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-700 disabled:opacity-30 transition"
                >
                  التالي ←
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}