"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowRight, Loader2, Check, ChevronDown } from "lucide-react";
import FatawaAudioManager from "@/components/admin/FatawaAudioManager";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/lib/useToast";

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-100 rounded-xl h-64 bg-gray-50 animate-pulse flex items-center justify-center text-xs text-gray-300">
        جارٍ تحميل المحرر...
      </div>
    ),
  }
);

type Category = { id: number; name: string };

export default function NewFatwaPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionerName, setQuestionerName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"pending" | "published">("published");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedFatwaId, setSavedFatwaId] = useState<number | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetch("/api/fatawa-categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function handleSubmit() {
    if (!question.trim()) {
      addToast("يرجى كتابة نص السؤال", "error");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/fatawa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        answer,
        questionerName: isAnonymous ? null : questionerName,
        isAnonymous,
        categoryId: categoryId ? Number(categoryId) : null,
        status,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      addToast("تم حفظ الفتوى بنجاح", "success");
      setLoading(false);
      setSavedFatwaId(data.id);
    } else {
      addToast("حدث خطأ أثناء الحفظ", "error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <button
            onClick={() => router.push("/admin/dashboard/fatawa")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors group"
          >
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            <span>العودة للفتاوى</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Status Toggle */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "pending" | "published")}
                className="appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full transition-colors cursor-pointer focus:outline-none border-0"
                style={{
                  backgroundColor: status === "published" ? "#f0fdf4" : "#fef3c7",
                  color: status === "published" ? "#15803d" : "#92400e",
                }}
              >
                <option value="published">منشور</option>
                <option value="pending">بانتظار الإجابة</option>
              </select>
              <ChevronDown size={12} className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* Save / Done Button */}
            {savedFatwaId ? (
              <button
                onClick={() => router.push("/admin/dashboard/fatawa")}
                className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-green-700 active:scale-[0.97] transition-all shadow-sm shadow-green-600/20"
              >
                <Check size={14} />
                <span>تم</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !question.trim()}
                className="flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-green-700 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-green-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>جارٍ الحفظ</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>حفظ الفتوى</span>
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
          <div className="lg:col-span-8 space-y-4">
            {/* Question */}
            <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">
                السؤال <span className="text-red-400">*</span>
              </p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="نص السؤال..."
                className="w-full bg-gray-50/80 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:bg-green-50/50 transition-colors resize-none border-0 leading-loose"
                dir="rtl"
              />
            </div>

            {/* Answer */}
            <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <p className="text-[11px] font-semibold text-gray-400 tracking-wider">الجواب</p>
              </div>
              <RichTextEditor
                value={answer}
                onChange={setAnswer}
                placeholder="اكتب الجواب هنا..."
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

            {/* Questioner Card */}
            <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
              <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">السائل</p>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-700">سائل مجهول</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {isAnonymous ? "لن يُذكر الاسم" : "سيُذكر الاسم"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous((p) => !p)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${isAnonymous ? "bg-green-600" : "bg-gray-200"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isAnonymous ? "right-0.5" : "left-0.5"
                      }`}
                  />
                </button>
              </div>
              {!isAnonymous && (
                <input
                  type="text"
                  value={questionerName}
                  onChange={(e) => setQuestionerName(e.target.value)}
                  placeholder="اسم السائل"
                  className="w-full bg-gray-50/80 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:bg-green-50/50 transition-colors border-0"
                />
              )}
            </div>

            {/* Audio Card / Tips Card */}
            {savedFatwaId ? (
              <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">🎧 الملفات الصوتية</p>
                <FatawaAudioManager fatawaId={savedFatwaId} />
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-green-50/60 to-emerald-50/40 p-5">
                <p className="text-[11px] font-semibold text-green-600/70 tracking-wider mb-2">💡 نصيحة</p>
                <p className="text-xs text-green-700/60 leading-relaxed">
                  احفظ الفتوى أولاً لتتمكن من إضافة ملفات صوتية للجواب إن أردت.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}