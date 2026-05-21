"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search, BookOpen } from "lucide-react";
import { formatArabicDate } from "@/lib/utils";
import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/lib/useToast";
import { useConfirm } from "@/lib/useConfirm";

type Post = {
  id: number;
  title: string;
  slug: string;
  status: string;
  createdAt: string | null;
  categoryName: string | null;
};

type Filter = "all" | "published" | "draft";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { toasts, addToast, removeToast } = useToast();
  const { open, options, confirm, handleConfirm, handleCancel } = useConfirm();

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => fetchPosts(), 0);
    }
    return () => { mounted = false; };
  }, []);

  async function handleDelete(id: number, title: string) {
    const confirmed = await confirm({
      title: "حذف الدرس",
      message: `هل أنت متأكد من حذف "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmLabel: "نعم، احذف",
      variant: "danger",
    });
    if (!confirmed) return;

    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("تم حذف الدرس بنجاح", "success");
      await fetchPosts();
    } else {
      addToast("حدث خطأ أثناء الحذف", "error");
    }
  }

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "published" && p.status === "published") ||
        (filter === "draft" && p.status === "draft");
      const matchesSearch =
        !search.trim() ||
        p.title.includes(search) ||
        p.categoryName?.includes(search);
      return matchesFilter && matchesSearch;
    });
  }, [posts, search, filter]);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };

  return (
    <div className="p-8 max-w-5xl" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-gray-400" />
            <h1 className="text-lg font-semibold text-gray-800">الدروس</h1>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {posts.length} درس
          </span>
        </div>
        <Link
          href="/admin/dashboard/posts/new"
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <Plus size={15} />
          درس جديد
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الدروس..."
            className="bg-transparent flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
        {(["all", "published", "draft"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-xl border transition whitespace-nowrap ${filter === f
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
          >
            {f === "all" ? "الكل" : f === "published" ? "منشور" : "مسودة"}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
              }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_90px_110px_80px] px-5 py-3 bg-gray-50 border-b border-gray-100">
          {["العنوان", "التصنيف", "الحالة", "التاريخ", ""].map((h) => (
            <div key={h} className="text-xs text-gray-400 font-medium">{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            {search ? `لا توجد نتائج لـ "${search}"` : "لا توجد دروس بعد"}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-[1fr_160px_90px_110px_80px] px-5 py-3.5 items-center hover:bg-gray-50 transition"
              >
                <div className="min-w-0 pl-3">
                  <p className="text-sm font-medium text-gray-800 truncate">{post.title}</p>
                </div>
                <div className="text-xs text-gray-400 truncate">{post.categoryName ?? "—"}</div>
                <div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md ${post.status === "published"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                    }`}>
                    {post.status === "published" ? "منشور" : "مسودة"}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{formatArabicDate(post.createdAt)}</div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/dashboard/posts/${post.id}/edit`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition"
                    title="تعديل"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
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