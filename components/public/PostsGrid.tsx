"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getCategoryColor } from "@/lib/categoryColors";
import { estimateReadTime, formatArabicDate } from "@/lib/utils";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  createdAt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

const PAGE_SIZE = 12;

export default function PostsGrid({
  posts,
  categories,
  initialCategory = null,
}: {
  posts: Post[];
  categories: Category[];
  initialCategory?: string | null;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        !activeCategory || post.categorySlug === activeCategory;
      const matchesSearch =
        !search.trim() ||
        post.title.includes(search) ||
        post.excerpt?.includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, search]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  function handleCategoryClick(slug: string | null) {
    setActiveCategory(slug);
    setPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
          {/* Search */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="ابحث في الدروس..."
              className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`text-xs px-4 py-1.5 rounded-full border transition ${
                activeCategory === null
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`text-xs px-4 py-1.5 rounded-full border transition ${
                  activeCategory === cat.slug
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results header ── */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-0.5 h-4 bg-green-700 rounded-full" />
          <h1 className="text-sm font-medium text-gray-800">الدروس والمحاضرات</h1>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {filtered.length} درس
        </span>
      </div>

      {/* ── Posts grid ── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">
              لا توجد نتائج لـ &quot;{search}&quot;
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory(null); }}
              className="mt-4 text-xs text-green-700 hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {paginated.map((post) => {
                const color = getCategoryColor(post.categorySlug);
                const readTime = estimateReadTime(post.content);
                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition block group"
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      {post.categoryName ? (
                        <span
                          className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}
                        >
                          {post.categoryName}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-[10px] text-gray-300">
                        {formatArabicDate(post.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm font-medium text-gray-800 leading-relaxed mb-2 group-hover:text-green-800 transition line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="text-xs text-green-700 group-hover:underline">
                        اقرأ الدرس ←
                      </span>
                      <span className="text-[10px] text-gray-300">
                        قراءة {readTime} دقائق
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-white border border-gray-200 text-gray-600 text-sm px-6 py-2.5 rounded-xl hover:border-green-300 hover:text-green-700 transition"
                >
                  تحميل المزيد — {filtered.length - paginated.length} درس متبقٍ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}