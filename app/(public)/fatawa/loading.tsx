export default function FatawaLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse" dir="rtl">
      <div className="h-10 bg-gray-100 rounded-xl mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-24" />
        ))}
      </div>
    </div>
  );
}
