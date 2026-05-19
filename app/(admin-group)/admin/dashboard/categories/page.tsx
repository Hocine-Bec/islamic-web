"use client";

import Toast from "@/components/admin/Toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/lib/useToast";
import { useConfirm } from "@/lib/useConfirm";
import { useEffect, useState } from "react";
import { Trash2, Plus, FolderOpen } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const { open, options, confirm, handleConfirm, handleCancel } = useConfirm();

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  }

  useEffect(() => { fetchCategories(); }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      addToast("تم إضافة التصنيف بنجاح", "success");
      setName("");
      setDescription("");
      setShowForm(false);
      await fetchCategories();
    } else {
      addToast("حدث خطأ أثناء الإضافة", "error");
    }
    setLoading(false);
  }

  async function handleDelete(id: number, catName: string) {
    const confirmed = await confirm({
      title: "حذف التصنيف",
      message: `هل أنت متأكد من حذف تصنيف "${catName}"؟ سيؤثر ذلك على الدروس المرتبطة به.`,
      confirmLabel: "نعم، احذف",
      variant: "danger",
    });
    if (!confirmed) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      addToast("تم حذف التصنيف بنجاح", "success");
      await fetchCategories();
    } else {
      addToast("حدث خطأ أثناء الحذف", "error");
    }
  }

  return (
    <div className="p-8 max-w-5xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FolderOpen size={18} className="text-gray-400" />
            <h1 className="text-lg font-semibold text-gray-800">تصنيفات الدروس</h1>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {categories.length} تصنيف
          </span>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <Plus size={15} />
          تصنيف جديد
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div className="bg-white border border-green-100 rounded-2xl p-5 mb-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            إضافة تصنيف جديد
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                اسم التصنيف <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: العقيدة الإسلامية"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                الوصف <span className="text-gray-300">(اختياري)</span>
              </label>
              <input
                type="text"
                placeholder="وصف مختصر للتصنيف"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleCreate}
                disabled={loading || !name.trim()}
                className="bg-green-700 hover:bg-green-800 text-white text-sm px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "جارٍ الحفظ..." : "حفظ التصنيف"}
              </button>
              <button
                onClick={() => { setShowForm(false); setName(""); setDescription(""); }}
                className="text-sm text-gray-400 hover:text-gray-600 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-[1fr_2fr_48px] px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="text-xs text-gray-400 font-medium">الاسم</div>
          <div className="text-xs text-gray-400 font-medium">الوصف</div>
          <div />
        </div>

        {/* Body */}
        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">لا توجد تصنيفات بعد</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-xs text-green-700 hover:underline"
            >
              أضف أول تصنيف
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="grid grid-cols-[1fr_2fr_48px] px-5 py-4 items-center hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800">
                    {cat.name}
                  </span>
                </div>
                <div className="text-xs text-gray-400 truncate pl-4">
                  {cat.description ?? (
                    <span className="text-gray-300 italic">بدون وصف</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition"
                  title="حذف"
                >
                  <Trash2 size={13} />
                </button>
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