"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AudioManager from "@/components/admin/AudioManager";
import { ArrowRight, Loader2, Send, ChevronDown, Check } from "lucide-react";

type Category = { id: number; name: string };

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedPostId, setSavedPostId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        excerpt,
        categoryId: categoryId ? Number(categoryId) : null,
        status,
      }),
    });
    const post = await res.json();
    setLoading(false);
    setSavedPostId(post.id);
  }

  return (
    <div className="min-h-screen">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <button
            onClick={() => router.push("/admin/dashboard/posts")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors group"
          >
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            <span>العودة للدروس</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Status Toggle */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full transition-colors cursor-pointer focus:outline-none bg-transparent border-0
                  ${status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}"
                style={{
                  backgroundColor: status === "published" ? "#f0fdf4" : "#f3f4f6",
                  color: status === "published" ? "#15803d" : "#6b7280",
                }}
              >
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
              <ChevronDown size={12} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* Save / Done Button */}
            {savedPostId ? (
              <button
                onClick={() => router.push("/admin/dashboard/posts")}
                className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-green-700 active:scale-[0.97] transition-all shadow-sm shadow-green-600/20"
              >
                <Check size={14} />
                <span>تم</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !title.trim()}
                className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-green-700 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-green-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>جارٍ الحفظ</span>
                  </>
                ) : (
                  <>
                    <Send size={14} className="rotate-180" />
                    <span>حفظ الدرس</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Editor Column */}
          <div className="lg:col-span-8">
            {/* Title */}
            <div className="mb-1">
              <input
                type="text"
                placeholder="عنوان الدرس..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold text-gray-800 placeholder-gray-300 bg-transparent border-0 focus:outline-none focus:ring-0 px-1 py-3"
                dir="rtl"
              />
              <div className="h-px bg-gradient-to-l from-green-200 via-gray-100 to-transparent" />
            </div>

            {/* Editor */}
            <div className="mt-4 rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="اكتب محتوى الدرس هنا... استخدم الأدوات أعلاه للتنسيق"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* Category Card */}
            <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">التصنيف</p>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full appearance-none bg-gray-50/80 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:bg-green-50/50 transition-colors cursor-pointer border-0"
                >
                  <option value="">بدون تصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Excerpt Card */}
            <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">المقتطف</p>
              <textarea
                rows={4}
                placeholder="وصف مختصر يظهر في نتائج البحث..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-gray-50/80 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed focus:outline-none focus:bg-green-50/50 transition-colors resize-none border-0"
                dir="rtl"
              />
            </div>

            {/* Audio Card — appears after post is saved */}
            {savedPostId ? (
              <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">🎧 الملفات الصوتية</p>
                <AudioManager postId={savedPostId} />
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-green-50/60 to-emerald-50/40 p-5">
                <p className="text-[11px] font-semibold text-green-600/70 tracking-wider mb-2">💡 نصيحة</p>
                <p className="text-xs text-green-700/60 leading-relaxed">
                  احفظ الدرس أولاً لتتمكن من إضافة الملفات الصوتية.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
