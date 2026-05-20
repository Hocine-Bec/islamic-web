"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing-components";

type AudioItem = {
  id: number;
  title: string;
  url: string;
  order: number;
};

export default function AudioManager({ postId }: { postId: number }) {
  const [audioList, setAudioList] = useState<AudioItem[]>([]);
  const [title, setTitle] = useState("");
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAudio() {
    const res = await fetch(`/api/audio/${postId}`);
    const data = await res.json();
    setAudioList(data);
  }

  useEffect(() => {
    fetchAudio();
  }, [postId]);

  async function handleSave() {
    if (!title.trim() || !pendingUrl) return;
    setLoading(true);
    await fetch(`/api/audio/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        url: pendingUrl,
        order: audioList.length,
      }),
    });
    setTitle("");
    setPendingUrl(null);
    await fetchAudio();
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا التسجيل؟")) return;
    await fetch(`/api/audio/item/${id}`, { method: "DELETE" });
    await fetchAudio();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <span>🎙️</span> التسجيلات الصوتية
      </h3>

      {/* Existing audio */}
      {audioList.length > 0 && (
        <div className="space-y-2">
          {audioList.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">
                  {item.title}
                </div>
                <audio controls src={item.url} className="w-full mt-1.5 h-8" />
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new audio */}
      <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
        <p className="text-xs text-gray-400 text-center">إضافة تسجيل صوتي جديد</p>

        <input
          type="text"
          placeholder="عنوان التسجيل (مثال: الجزء الأول)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {!pendingUrl ? (
          <UploadButton
            endpoint="audioUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) setPendingUrl(res[0].ufsUrl);
            }}
            onUploadError={(err) => alert(`خطأ في الرفع: ${err.message}`)}
            appearance={{
              button: "bg-green-700 hover:bg-green-800 text-white text-sm px-4 py-2 rounded-lg w-full",
              allowedContent: "text-gray-400 text-xs",
            }}
            content={{
              button: "رفع ملف صوتي",
              allowedContent: "MP3, WAV, M4A — حتى 64MB",
            }}
          />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <span className="text-green-600 text-sm">✅</span>
              <span className="text-xs text-green-700">تم رفع الملف بنجاح</span>
              <button
                onClick={() => setPendingUrl(null)}
                className="mr-auto text-xs text-gray-400 hover:text-gray-600"
              >
                إلغاء
              </button>
            </div>
            <audio controls src={pendingUrl} className="w-full h-8" />
            <button
              onClick={handleSave}
              disabled={!title.trim() || loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white text-sm py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "جارٍ الحفظ..." : "حفظ التسجيل"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}