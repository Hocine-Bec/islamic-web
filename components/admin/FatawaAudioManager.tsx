"use client";

import { useState, useEffect } from "react";
import { useUploadThing } from "@/lib/uploadthingClient";

type AudioFile = {
  id: number;
  title: string;
  url: string;
  order: number | null;
};

export default function FatawaAudioManager({ fatawaId }: { fatawaId: number }) {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const { startUpload } = useUploadThing("fatawaAudioUploader", {
    onUploadProgress: (p) => setProgress(p),
  });

  async function fetchFiles() {
    const res = await fetch(`/api/fatawa-audio/fatwa/${fatawaId}`);
    const data = await res.json();
    setFiles(data);
  }

  useEffect(() => { fetchFiles(); }, [fatawaId]);

  async function handleUpload() {
    if (!selectedFile || !title.trim()) return;
    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const uploaded = await startUpload([selectedFile]);
      if (!uploaded || uploaded.length === 0) throw new Error("فشل الرفع");

      await fetch("/api/fatawa-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fatawaId,
          title,
          url: uploaded[0].url,
          order: files.length,
        }),
      });

      setTitle("");
      setSelectedFile(null);
      await fetchFiles();
    } catch {
      setError("حدث خطأ أثناء الرفع. حاول مرة أخرى.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف الصوتي؟")) return;
    await fetch(`/api/fatawa-audio/${id}`, { method: "DELETE" });
    await fetchFiles();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-700 mb-4">🎧 الملفات الصوتية للجواب</h3>

      {files.length > 0 && (
        <div className="space-y-2 mb-5">
          {files.map((f, i) => (
            <div key={f.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-400 w-5 text-center">{i + 1}</span>
              <span className="text-sm text-gray-700 flex-1 truncate">{f.title}</span>
              <audio src={f.url} controls className="h-7 w-40" />
              <button onClick={() => handleDelete(f.id)} className="text-red-400 hover:text-red-600 text-xs">
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="عنوان الملف الصوتي"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-4 py-5 cursor-pointer hover:border-green-300 transition">
          <span className="text-2xl">🎵</span>
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : "اختر ملفاً صوتياً"}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">MP3, WAV, M4A — حتى 128MB</div>
          </div>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)} />
        </label>

        {uploading && (
          <div className="space-y-1">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-green-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-gray-400 text-center">{progress}%</div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile || !title.trim()}
          className="w-full bg-green-600 text-white text-sm py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {uploading ? `جارٍ الرفع... ${progress}%` : "رفع الملف الصوتي"}
        </button>
      </div>
    </div>
  );
}