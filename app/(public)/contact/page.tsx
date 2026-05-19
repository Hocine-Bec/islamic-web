"use client";

import { useState } from "react";
import Image from "next/image";

const WHATSAPP = "https://wa.me/213XXXXXXXXX";
const EMAIL = "mailto:contact@example.com";
const TELEGRAM = "https://t.me/username";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [anonymous, setAnonymous] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAnonymousToggle() {
    setAnonymous((prev) => {
      if (!prev) {
        // Switching TO anonymous — clear personal fields
        setForm((f) => ({ ...f, name: "", email: "" }));
      }
      return !prev;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    if (!anonymous && (!form.name || !form.email)) return;

    setStatus("loading");

    await fetch("/api/fatawa/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `[${form.subject}]\n\n${form.message}`,
        questionerName: anonymous ? null : form.name,
        isAnonymous: anonymous,
      }),
    });

    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
    setAnonymous(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12" dir="rtl">
      {/* Page header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Image
            src="/logo.png"
            alt="شعار"
            width={44}
            height={44}
            className="object-contain"
          />
        </div>
        <h1 className="text-xl font-medium text-gray-800 mb-2">
          تواصل مع الشيخ
        </h1>
        <p className="text-sm text-gray-400">
          للأسئلة الشرعية والمراسلات — نسعد بتواصلكم
        </p>
      </div>

      {/* Quick contact buttons */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 bg-green-50 border border-green-100 hover:border-green-300 rounded-xl py-4 px-2 transition"
        >
          <span className="text-2xl">📱</span>
          <span className="text-xs font-medium text-green-700">واتساب</span>
          <span className="text-[10px] text-gray-400">للأسئلة الشرعية</span>
        </a>

        <a
          href={EMAIL}
          className="flex flex-col items-center gap-1.5 bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl py-4 px-2 transition"
        >
          <span className="text-2xl">✉️</span>
          <span className="text-xs font-medium text-blue-700">البريد الإلكتروني</span>
          <span className="text-[10px] text-gray-400">للمراسلات الرسمية</span>
        </a>

        <a
          href={TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 bg-sky-50 border border-sky-100 hover:border-sky-300 rounded-xl py-4 px-2 transition"
        >
          <span className="text-2xl">✈️</span>
          <span className="text-xs font-medium text-sky-700">تيليغرام</span>
          <span className="text-[10px] text-gray-400">للمتابعة والدروس</span>
        </a>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">أو أرسل رسالة مباشرة</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Contact form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        {status === "success" ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-base font-medium text-gray-800 mb-2">
              تم إرسال سؤالك بنجاح
            </h2>
            <p className="text-sm text-gray-400 mb-2">
              سيراجع الشيخ سؤالك ويجيب عليه قريباً بإذن الله.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              يمكنك متابعة الإجابة في قسم <a href="/fatawa" className="text-green-700 hover:underline">الفتاوى</a> عند نشرها.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm text-green-700 hover:underline"
            >
              إرسال سؤال آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Anonymous toggle */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm font-medium text-gray-700">إرسال بشكل مجهول</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {anonymous
                    ? "لن يُرفق اسمك أو بريدك مع الرسالة"
                    : "سيُرفق اسمك وبريدك مع الرسالة"}
                </div>
              </div>
              <button
                type="button"
                onClick={handleAnonymousToggle}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${anonymous ? "bg-green-600" : "bg-gray-200"
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${anonymous ? "right-0.5" : "left-0.5"
                    }`}
                />
              </button>
            </div>

            {/* Name + Email — hidden when anonymous */}
            {!anonymous && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    الاسم الكامل <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    البريد الإلكتروني <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>
              </div>
            )}

            {/* Anonymous notice */}
            {anonymous && (
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <span className="text-blue-400 text-base mt-0.5">🔒</span>
                <p className="text-xs text-blue-600 leading-relaxed">
                  أنت ترسل رسالتك بشكل مجهول. لن يتمكن الشيخ من الرد عليك مباشرة، لكن قد يتم نشر الجواب في قسم الفتاوى عند اكتماله.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                الموضوع <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="موضوع رسالتك"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                الرسالة <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="اكتب رسالتك هنا..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-300 resize-none"
              />
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-700 leading-relaxed">
              <span className="font-medium">ملاحظة: </span>
              يُرجى صياغة سؤالك بوضوح وذكر المسألة كاملة لتسهيل الإجابة عليها.
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-green-700 hover:bg-green-800 text-white text-sm py-2.5 rounded-lg transition disabled:opacity-50 font-medium"
            >
              {status === "loading" ? "جارٍ الإرسال..." : "إرسال الرسالة"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}