"use client";

import { useState, useEffect } from "react";
import { useUploadThing } from "@/lib/uploadthingClient";

type AudioFile = {
  id: number;
  title: string;
  url: string;
  order: number | null;
};

export default function AudioManager({ postId }: { postId: number }) {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("audioUploader", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        await fetch("/api/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            title,
            url: res[0].url,
            order: files.length,
          }),
        });
        setTitle("");
        setProgress(0);
        await fetchFiles();
      }
    },
    onUploadError: (e) => {
      alert(`خطأ في الرفع: ${e.message}`);
    },
  });

  async function fetchFiles() {
    const res = await fetch(`/api/audio/post/${postId}`);
    const data = await res.json();
    setFiles(data);
  }

  useEffect(() => {
    fetchFiles();
  }, [postId]);

  async function handleDelete(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف الصوتي؟")) return;
    await fetch(`/api/audio/${id}`, { method: "DELETE" });
    await fetchFiles();
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!title.trim()) {
          alert("الرجاء إدخال عنوان الملف الصوتي أولاً");
          e.target.value = "";
          return;
      }
      await startUpload([file]);
      e.target.value = "";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
        🎧 الملفات الصوتية
      </h3>

      {/* Existing files */}
      {files.length > 0 && (
        <div className="space-y-2 mb-5">
          {files.map((f, i) => (
            <div
              key={f.id}
              className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-xs text-gray-400 w-5 text-center">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 flex-1 truncate">
                {f.title}
              </span>
              <audio src={f.url} controls className="h-7 w-40" />
              <button
                onClick={() => handleDelete(f.id)}
                className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload form */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="عنوان الملف الصوتي (مثال: الجزء الأول)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          disabled={isUploading || !title.trim()}
          className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
        />

        {isUploading && (
          <div className="space-y-1">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-green-600 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 text-center">{progress}%</div>
          </div>
        )}
      </div>
    </div>
  );
}