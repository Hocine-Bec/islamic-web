"use client";

import { useState, useRef, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

type AudioFile = {
  id: number;
  title: string;
  url: string;
  order: number | null;
};

export default function AudioPlayer({ files }: { files: AudioFile[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = files[currentIndex];

  if (files.length === 0) return null;

  return (
    <div className="mb-8" dir="rtl">
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
        {/* Download button */}
        <a
          href={current.url}
          download
          title="تحميل المادة"
          className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-lg transition flex-shrink-0"
        >
          <FiDownload />
          <span>تحميل المادة</span>
        </a>

        {/* Native audio player */}
        <audio
          ref={audioRef}
          src={current.url}
          controls
          className="flex-1 h-8"
          preload="metadata"
        />
      </div>

      {/* Multiple files */}
      {files.length > 1 && (
        <div className="mt-2 space-y-1">
          {files.map((file, i) => (
            <button
              key={file.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right text-xs transition ${i === currentIndex
                  ? "bg-green-50 text-green-800 font-medium border border-green-100"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <span className="w-4 text-center">{i + 1}</span>
              <span className="truncate">{file.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
