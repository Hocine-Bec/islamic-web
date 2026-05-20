
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import RichContent from "@/components/public/RichContent";
import { getPublishedPostBySlug } from "@/lib/queries/posts";
import { getApprovedCommentsByPost } from "@/lib/queries/comments";
import { getAudioByPost } from "@/lib/queries/audio";
import { getCategoryColor } from "@/lib/categoryColors";
import { formatArabicDate, estimateReadTime } from "@/lib/utils";
import CommentSection from "@/components/public/CommentSection";
import AudioPlayer from "@/components/public/AudioPlayer";
import ReportMistake from "@/components/public/ReportMistake";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPublishedPostBySlug(decodedSlug);
  if (!post) notFound();

  const [comments, audioFiles] = await Promise.all([
    getApprovedCommentsByPost(post.id),
    getAudioByPost(post.id),
  ]);

  const color = getCategoryColor(post.categorySlug ?? null);
  const readTime = estimateReadTime(post.content ?? "");

  return (
    <div className="max-w-3xl mx-auto px-6 py-10" dir="rtl">
      {/* Meta row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {post.categoryName && (
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${color.bg} ${color.text}`}
          >
            {post.categoryName}
          </span>
        )}
        <span className="text-xs text-gray-400">
          {formatArabicDate(post.createdAt)}
        </span>
        <span className="text-gray-200 text-xs">•</span>
        <span className="text-xs text-gray-400">
          قراءة {readTime} دقائق
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-medium text-gray-800 mb-8 leading-relaxed">
        {post.title}
      </h1>

      {/* Audio player */}
      {audioFiles.length > 0 && <AudioPlayer files={audioFiles} />}

      {/* Content */}
      <div className="prose prose-sm max-w-none text-gray-700 leading-loose" dir="rtl">
        {/* Content */}
        <RichContent html={post.content ?? ""} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mt-12" />

      {/* Comments */}
      <CommentSection postId={post.id} initialComments={comments} />

      {/* Report mistake */}
      <div className="flex items-center justify-start mt-10 pt-6 border-t border-gray-100">
        <ReportMistake postId={post.id} postTitle={post.title} />
      </div>
    </div>
  );
}