"use client";

import { useState } from "react";

type Comment = {
  id: number;
  authorName: string;
  content: string;
  createdAt: string | null;
};

export default function CommentSection({
  postId,
  initialComments,
}: {
  postId: number;
  initialComments: Comment[];
}) {
  const [comments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;
    setLoading(true);

    await fetch(`/api/comments/post/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, content }),
    });

    setAuthorName("");
    setContent("");
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="mt-16" dir="rtl">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-0.5 h-4 bg-green-700 rounded-full" />
        <h2 className="text-sm font-medium text-gray-800">
          التعليقات
          {comments.length > 0 && (
            <span className="mr-1.5 text-xs text-gray-400 font-normal">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 mb-6">
          <p className="text-sm text-gray-400">
            لا توجد تعليقات بعد — كن أول من يعلّق
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-gray-100 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-medium flex-shrink-0">
                    {comment.authorName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {comment.authorName}
                  </span>
                </div>
                <span className="text-[10px] text-gray-300">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString("ar-DZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : ""}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pr-9">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          أضف تعليقاً
        </h3>

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm text-gray-500 mb-1">
              شكراً على تعليقك!
            </p>
            <p className="text-xs text-gray-400 mb-4">
              سيظهر تعليقك بعد مراجعته من قِبل الشيخ.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-green-700 hover:underline"
            >
              إضافة تعليق آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="اسمك"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300"
            />
            <textarea
              placeholder="اكتب تعليقك هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300 resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-gray-400">
                سيُراجَع تعليقك قبل النشر
              </p>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white text-sm px-5 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "جارٍ الإرسال..." : "إرسال"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}