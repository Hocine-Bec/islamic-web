"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { formatArabicDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { getCategoryColor } from "@/lib/categoryColors";

const PAGE_SIZE = 12;

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

export default function FatawaGrid({
  fatawa,
  categories,
  totalCount,
  currentPage,
  activeCategory,
}: {
  fatawa: Fatwa[];
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

  const filtered = search.trim()
    ? fatawa.filter((f) => f.question.includes(search))
    : fatawa;

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
              placeholder="ابحث في الفتاوى..."
              className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 text-xs">✕</button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate({ page: 1 })}
              className={`text-xs px-4 py-1.5 rounded-full border transition ${!activeCategory ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-500 border-gray-200"
                }`}
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate({ category: cat.slug, page: 1 })}
                className={`text-xs px-4 py-1.5 rounded-full border transition ${activeCategory === cat.slug ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-500 border-gray-200"
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
          {totalCount} فتوى
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">لا توجد نتائج</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mt-4">
              {filtered.map((f) => (
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => navigate({ page: currentPage - 1, category: activeCategory })}
                  disabled={currentPage <= 1 || isPending}
                  className="text-xs px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-green-300 disabled:opacity-30 transition"
                >
                  → السابق
                </button>
                <span className="text-xs text-gray-400 px-3">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => navigate({ page: currentPage + 1, category: activeCategory })}
                  disabled={currentPage >= totalPages || isPending}
                  className="text-xs px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-green-300 disabled:opacity-30 transition"
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