export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse" dir="rtl">
      <div className="h-5 w-24 bg-gray-100 rounded-full mb-4" />
      <div className="h-8 bg-gray-100 rounded-xl mb-2" />
      <div className="h-8 bg-gray-100 rounded-xl w-3/4 mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded-full" style={{ width: i % 2 === 0 ? '100%' : '80%' }} />
        ))}
      </div>
    </div>
  );
}
