"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, ScrollText, MessageCircleQuestion } from "lucide-react";
import { formatArabicDate } from "@/lib/utils";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/lib/useToast";
import { useConfirm } from "@/lib/useConfirm";

type Fatwa = {
  id: number;
  question: string;
  slug: string;
  status: string;
  questionerName: string | null;
  isAnonymous: boolean | null;
  createdAt: string | null;
  categoryName: string | null;
};

type Filter = "all" | "pending" | "published";

export default function FatawaAdminPage() {
  const [fatawa, setFatawa] = useState<Fatwa[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { toasts, addToast, removeToast } = useToast();
  const { open, options, confirm, handleConfirm, handleCancel } = useConfirm();

  async function fetchFatawa() {
    const res = await fetch("/api/fatawa");
    const data = await res.json();
    setFatawa(data);
  }

  useEffect(() => { fetchFatawa(); }, []);

  async function handleDelete(id: number, question: string) {
    const confirmed = await confirm({
      title: "حذف الفتوى",
      message: `هل أنت متأكد من حذف هذه الفتوى؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmLabel: "نعم، احذف",
      variant: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/fatawa/${id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("تم حذف الفتوى بنجاح", "success");
      await fetchFatawa();
    } else {
      addToast("حدث خطأ أثناء الحذف", "error");
    }
  }

  const filtered = useMemo(() => {
    return fatawa.filter((f) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && f.status === "pending") ||
        (filter === "published" && f.status === "published");
      const matchesSearch =
        !search.trim() ||
        f.question.includes(search) ||
        f.categoryName?.includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [fatawa, search, filter]);

  const counts = {
    all: fatawa.length,
    pending: fatawa.filter((f) => f.status === "pending").length,
    published: fatawa.filter((f) => f.status === "published").length,
  };

  return (
    <div className="p-8 max-w-5xl" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ScrollText size={18} className="text-gray-400" />
            <h1 className="text-lg font-semibold text-gray-800">الفتاوى</h1>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {fatawa.length} فتوى
          </span>
        </div>
        <Link
          href="/admin/dashboard/fatawa/new"
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <Plus size={15} />
          فتوى جديدة
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الفتاوى..."
            className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
        {(["all", "pending", "published"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-xl border transition whitespace-nowrap ${filter === f
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
          >
            {f === "all" ? "الكل" : f === "pending" ? "بانتظار الإجابة" : "منشور"}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f
                ? "bg-white/20 text-white"
                : f === "pending" && counts.pending > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-400"
              }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_110px_110px_80px] px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["السؤال", "السائل", "التصنيف", "التاريخ", ""].map((h) => (
            <div key={h} className="text-xs text-gray-400 font-medium">{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageCircleQuestion size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              {search ? `لا توجد نتائج لـ "${search}"` : "لا توجد فتاوى بعد"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-[1fr_120px_110px_110px_80px] px-5 py-3.5 items-center hover:bg-gray-50 transition"
              >
                <div className="min-w-0 pl-3 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.status === "pending" ? "bg-amber-400" : "bg-green-400"
                    }`} />
                  <p className="text-sm font-medium text-gray-800 truncate">{f.question}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {f.isAnonymous ? (
                    <span className="text-gray-300 italic">مجهول</span>
                  ) : (
                    f.questionerName ?? "—"
                  )}
                </div>
                <div className="text-xs text-gray-400 truncate">{f.categoryName ?? "—"}</div>
                <div className="text-xs text-gray-400">{formatArabicDate(f.createdAt)}</div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/dashboard/fatawa/${f.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition"
                    title={f.status === "pending" ? "أجب على السؤال" : "تعديل"}
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    onClick={() => handleDelete(f.id, f.question)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition"
                    title="حذف"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={open}
        title={options.title}
        message={options.message}
        confirmLabel={options.confirmLabel}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}