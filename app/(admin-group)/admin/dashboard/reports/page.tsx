"use client";

import { useEffect, useState } from "react";
import { formatArabicDate } from "@/lib/utils";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Toast from "@/components/admin/Toast";
import { useToast } from "@/lib/useToast";
import { useConfirm } from "@/lib/useConfirm";
import { CheckCircle2, Trash2 } from "lucide-react";

type Report = {
  id: number;
  postId: number;
  type: string;
  details: string;
  isRead: boolean;
  createdAt: string;
  postTitle: string | null;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toasts, addToast, removeToast } = useToast();
  const confirm = useConfirm();

  async function fetchReports() {
    setLoading(true);
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function handleToggleRead(id: number, currentReadStatus: boolean) {
    const res = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !currentReadStatus }),
    });

    if (res.ok) {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isRead: !currentReadStatus } : r))
      );
      addToast(
        !currentReadStatus ? "تم وضع علامة مقروء" : "تم وضع علامة غير مقروء",
        "success"
      );
    } else {
      addToast("حدث خطأ أثناء تحديث البلاغ", "error");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = await confirm.confirm({
      title: "حذف البلاغ",
      message: "هل أنت متأكد أنك تريد حذف هذا البلاغ بشكل نهائي؟",
      confirmLabel: "حذف البلاغ",
      variant: "danger",
    });

    if (!confirmed) return;

    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      addToast("تم حذف البلاغ بنجاح", "success");
    } else {
      addToast("حدث خطأ أثناء حذف البلاغ", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-800">بلاغات الأخطاء</h1>
          <p className="text-sm text-gray-400 mt-1">إدارة البلاغات الواردة من المستخدمين حول محتوى الدروس</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">لا توجد بلاغات حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 w-[15%]">نوع الخطأ</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 w-[20%]">الدرس المرتبط</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 w-[35%]">التفاصيل</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 w-[15%]">التاريخ</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 w-[15%] text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className={`transition-colors hover:bg-gray-50/50 ${
                      !report.isRead ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-center gap-2">
                        {!report.isRead && (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        )}
                        <span className="text-sm font-medium text-gray-800">
                          {report.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <span className="text-xs text-gray-500 line-clamp-2">
                        {report.postTitle ?? "درس محذوف"}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-w-sm">
                        {report.details}
                      </p>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <span className="text-xs text-gray-400">
                        {formatArabicDate(report.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleRead(report.id, report.isRead)}
                          className={`p-1.5 rounded-md transition-colors ${
                            report.isRead
                              ? "text-gray-400 hover:text-green-600 hover:bg-green-50"
                              : "text-green-600 bg-green-50 hover:bg-green-100"
                          }`}
                          title={report.isRead ? "تحديد كغير مقروء" : "تحديد كمقروء"}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="حذف البلاغ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={confirm.options.title}
        message={confirm.options.message}
        confirmLabel={confirm.options.confirmLabel}
        variant={confirm.options.variant}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleCancel}
      />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
