"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success";

export default function ReportMistake({
  postId,
  postTitle,
}: {
  postId: number;
  postTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const mistakeTypes = [
    "خطأ في النص أو المعلومة",
    "خطأ في الآية القرآنية",
    "خطأ في الحديث النبوي",
    "خطأ إملائي أو لغوي",
    "مشكلة في الصوت",
    "أخرى",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !details.trim()) return;
    setStatus("loading");
    
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, type, details }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("idle");
        alert("حدث خطأ، يرجى المحاولة لاحقاً");
      }
    } catch {
      setStatus("idle");
      alert("حدث خطأ، يرجى المحاولة لاحقاً");
    }
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setType("");
    setDetails("");
  }

  return (
    <>
      {/* Trigger — subtle red pill */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-red-400 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
      >
        <span>⚠</span>
        <span>الإبلاغ عن خطأ</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center px-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "success" ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h2 className="text-base font-medium text-gray-800 mb-2">
                  تم إرسال البلاغ
                </h2>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  شكراً لمساهمتك في تصحيح المحتوى. سيراجع الشيخ البلاغ قريباً بإذن الله.
                </p>
                <button
                  onClick={handleClose}
                  className="text-sm text-green-700 hover:underline"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-sm font-medium text-gray-800">
                      إبلاغ عن خطأ
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                      {postTitle}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                    <span className="text-blue-400 text-sm">🔒</span>
                    <p className="text-xs text-blue-600">
                      يُرسل هذا البلاغ بشكل مجهول تماماً
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      نوع الخطأ <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {mistakeTypes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`text-xs px-3 py-2 rounded-lg border text-right transition ${type === t
                            ? "bg-green-50 border-green-300 text-green-700 font-medium"
                            : "border-gray-200 text-gray-500 hover:border-green-200"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      تفاصيل الخطأ <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={3}
                      placeholder="اذكر الخطأ بوضوح مع ذكر موضعه في الدرس إن أمكن..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!type || !details.trim() || status === "loading"}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2.5 rounded-lg transition disabled:opacity-40 font-medium"
                  >
                    {status === "loading" ? "جارٍ الإرسال..." : "إرسال البلاغ"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}