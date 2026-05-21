"use client";

import { useEffect, useState, useMemo } from "react";
import { Check, Trash2, Search, MessageSquare } from "lucide-react";
import { formatArabicDate } from "@/lib/utils";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/lib/useToast";
import { useConfirm } from "@/lib/useConfirm";

type Comment = {
  id: number;
  authorName: string;
  content: string;
  approved: boolean;
  createdAt: string | null;
  postTitle: string | null;
  postSlug: string | null;
};

type Filter = "all" | "pending" | "approved";

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const { open, options, confirm, handleConfirm, handleCancel } = useConfirm();

  async function fetchComments() {
    const res = await fetch("/api/comments");
    const data = await res.json();
    setComments(data);
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => fetchComments(), 0);
    }
    return () => { mounted = false; };
  }, []);

  async function handleApprove(id: number) {
    const confirmed = await confirm({
      title: "قبول التعليق",
      message: "هل تريد قبول هذا التعليق ونشره على الموقع؟",
      confirmLabel: "نعم، اقبل",
      variant: "warning",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/comments/${id}`, { method: "PUT" });
    if (res.ok) {
      addToast("تم قبول التعليق بنجاح", "success");
      await fetchComments();
    } else {
      addToast("حدث خطأ", "error");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = await confirm({
      title: "حذف التعليق",
      message: "هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.",
      confirmLabel: "نعم، احذف",
      variant: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("تم حذف التعليق بنجاح", "success");
      await fetchComments();
    } else {
      addToast("حدث خطأ أثناء الحذف", "error");
    }
  }

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "pending" && !c.approved) ||
        (filter === "approved" && c.approved);
      const matchesSearch =
        !search.trim() ||
        c.authorName.includes(search) ||
        c.content.includes(search) ||
        c.postTitle?.includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [comments, search, filter]);

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => !c.approved).length,
    approved: comments.filter((c) => c.approved).length,
  };

  return (
    <div className="p-8 max-w-5xl" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-gray-400" />
            <h1 className="text-lg font-semibold text-gray-800">التعليقات</h1>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {comments.length} تعليق
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في التعليقات..."
            className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
        {(["all", "pending", "approved"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-xl border transition whitespace-nowrap ${filter === f
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
          >
            {f === "all" ? "الكل" : f === "pending" ? "معلق" : "مقبول"}
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
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              {search ? `لا توجد نتائج لـ "${search}"` : "لا توجد تعليقات"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((comment) => (
              <div key={comment.id} className="px-5 py-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold flex-shrink-0 mt-0.5">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium text-gray-800">{comment.authorName}</span>
                      <span className="text-gray-200 text-xs">•</span>
                      <span className="text-xs text-gray-400">{formatArabicDate(comment.createdAt)}</span>
                      <span className="text-gray-200 text-xs">•</span>
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">{comment.postTitle ?? "—"}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md mr-auto ${comment.approved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`}>
                        {comment.approved ? "مقبول" : "معلق"}
                      </span>
                    </div>
                    <p className={`text-sm text-gray-600 leading-relaxed ${expanded === comment.id ? "" : "line-clamp-2"}`}>
                      {comment.content}
                    </p>
                    {comment.content.length > 120 && (
                      <button
                        onClick={() => setExpanded(expanded === comment.id ? null : comment.id)}
                        className="text-xs text-green-700 hover:underline mt-1"
                      >
                        {expanded === comment.id ? "عرض أقل" : "عرض الكل"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!comment.approved && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition"
                        title="قبول التعليق"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition"
                      title="حذف"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
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