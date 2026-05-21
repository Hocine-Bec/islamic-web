export default function PostsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse" dir="rtl">
      <div className="h-10 bg-gray-100 rounded-xl mb-4" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-100 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-36" />
        ))}
      </div>
    </div>
  );
}
