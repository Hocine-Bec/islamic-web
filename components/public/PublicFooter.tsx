export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-6 text-center text-xs text-gray-400">
        جميع الحقوق محفوظة © {new Date().getFullYear()} — أبو العباس محمد رحيل بن إسماعيل
      </div>
    </footer>
  );
}