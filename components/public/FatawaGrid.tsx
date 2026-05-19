"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatArabicDate } from "@/lib/utils";
import { getCategoryColor } from "@/lib/categoryColors";

type Fatwa = {
  id: number;
  slug: string;
  question: string;
  questionerName: string | null;
  isAnonymous: boolean | null;
  createdAt: string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

type Category = { id: number; name: string; slug: string };

const PAGE_SIZE = 12;

export default function FatawaGrid({
  fatawa,
  categories,
  initialCategory = null,
}: {
  fatawa: Fatwa[];
  categories: Category[];
  initialCategory?: string | null;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return fatawa.filter((f) => {
      const matchesCategory = !activeCategory || f.categorySlug === activeCategory;
      const matchesSearch = !search.trim() || f.question.includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [fatawa, activeCategory, search]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <>
      {/* Filter bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="ابحث في الفتاوى..."
              className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 text-xs">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setActiveCategory(null); setPage(1); }}
              className={`text-xs px-4 py-1.5 rounded-full border transition ${activeCategory === null
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
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

      {/* Results */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-0.5 h-4 bg-green-700 rounded-full" />
          <h1 className="text-sm font-medium text-gray-800">الفتاوى</h1>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {filtered.length} فتوى
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">لا توجد نتائج</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory(null); }}
              className="mt-4 text-xs text-green-700 hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mt-4">
              {paginated.map((f) => (
                <Link
                  key={f.id}
                  href={`/fatawa/${f.slug}`}
                  className="bg-white border border-gray-100 rounded-xl p-5 hover:border-green-200 hover:shadow-sm transition block group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-700 text-sm flex-shrink-0 mt-0.5">
                      ؟
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {f.categoryName && (
                          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${getCategoryColor(f.categorySlug).bg} ${getCategoryColor(f.categorySlug).text}`}>
                            {f.categoryName}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-300">
                          {formatArabicDate(f.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed group-hover:text-green-800 transition line-clamp-2">
                        {f.question}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-gray-400">
                          {f.isAnonymous ? "سائل مجهول" : f.questionerName ?? ""}
                        </span>
                        <span className="text-xs text-green-700 group-hover:underline">
                          اقرأ الجواب ←
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-white border border-gray-200 text-gray-600 text-sm px-6 py-2.5 rounded-xl hover:border-green-300 hover:text-green-700 transition"
                >
                  تحميل المزيد — {filtered.length - paginated.length} فتوى متبقية
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}