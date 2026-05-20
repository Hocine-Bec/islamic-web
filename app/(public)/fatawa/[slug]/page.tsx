import { notFound } from "next/navigation";
import RichContent from "@/components/public/RichContent";
import { getFatawaBySlug, getAudioByFatwa } from "@/lib/queries/fatawa";
import { formatArabicDate } from "@/lib/utils";
import AudioPlayer from "@/components/public/AudioPlayer";
import { getCategoryColor } from "@/lib/categoryColors";

export default async function SingleFatwaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const fatwa = await getFatawaBySlug(decodedSlug);
  if (!fatwa || fatwa.status !== "published") notFound();

  const audioFiles = await getAudioByFatwa(fatwa.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10" dir="rtl">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {fatwa.categoryName && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(fatwa.categorySlug).bg} ${getCategoryColor(fatwa.categorySlug).text}`}>
            {fatwa.categoryName}
          </span>
        )}
        <span className="text-xs text-gray-400">
          {formatArabicDate(fatwa.createdAt)}
        </span>
      </div>

      {/* Question block */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
            س
          </div>
          <div className="flex-1">
            <div className="text-xs text-green-600 font-medium mb-2">السؤال</div>
            <p className="text-sm text-gray-800 leading-loose">{fatwa.question}</p>
            {!fatwa.isAnonymous && fatwa.questionerName && (
              <p className="text-xs text-gray-400 mt-3">
                السائل: {fatwa.questionerName}
              </p>
            )}
            {fatwa.isAnonymous && (
              <p className="text-xs text-gray-400 mt-3">سائل مجهول</p>
            )}
          </div>
        </div>
      </div>

      {/* Answer */}
      {fatwa.answer ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm flex-shrink-0">
              ج
            </div>
            <span className="text-xs text-gray-600 font-medium">الجواب</span>
          </div>

          {/* Audio */}
          {audioFiles.length > 0 && <AudioPlayer files={audioFiles} />}

          {/* Answer content */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-loose" dir="rtl">
            <RichContent html={fatwa.answer} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-400 text-sm">لم يتم الإجابة على هذا السؤال بعد</p>
        </div>
      )}
    </div>
  );
}