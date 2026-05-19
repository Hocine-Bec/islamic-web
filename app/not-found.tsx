import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="text-6xl mb-4">☪</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-500 mb-6">الصفحة التي تبحث عنها غير موجودة</p>
        <Link
          href="/"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
