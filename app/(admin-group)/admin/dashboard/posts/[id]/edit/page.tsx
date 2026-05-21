"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import AudioManager from "@/components/admin/AudioManager";

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

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function load() {
      const [postRes, catsRes] = await Promise.all([
        fetch(`/api/posts/${id}`),
        fetch("/api/categories"),
      ]);
      const post = await postRes.json();
      const cats = await catsRes.json();

      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt ?? "");
      setCategoryId(post.categoryId ? String(post.categoryId) : "");
      setStatus(post.status);
      setCategories(cats);
      setFetching(false);
    }
    load();
  }, [id]);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        excerpt,
        categoryId: categoryId ? Number(categoryId) : null,
        status,
      }),
    });
    router.push("/admin/dashboard/posts");
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">تعديل الدرس</h1>

      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المقتطف</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">بدون تصنيف</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المحتوى
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="اكتب محتوى الدرس هنا..."
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="draft">مسودة</option>
            <option value="published">نشر</option>
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>

          <button
            onClick={() => router.push("/admin/dashboard/posts")}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            إلغاء
          </button>
          {/* Audio manager — only shown when editing existing post */}
          <div className="pt-4 border-t border-gray-100">
            <AudioManager postId={Number(id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
