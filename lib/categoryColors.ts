const colors: Record<string, { bg: string; text: string }> = {
  "al-aqida":   { bg: "bg-amber-100",  text: "text-amber-800"  },
  "tafsir-quran": { bg: "bg-purple-100", text: "text-purple-800" },
  "hadith":     { bg: "bg-green-100",  text: "text-green-800"  },
  "fiqh":       { bg: "bg-blue-100",   text: "text-blue-800"   },
  "sira":       { bg: "bg-pink-100",   text: "text-pink-800"   },
  "akhlaq":     { bg: "bg-sky-100",    text: "text-sky-800"    },
  "usul-fiqh":  { bg: "bg-indigo-100", text: "text-indigo-800" },
  "fiqh-usra":  { bg: "bg-rose-100",   text: "text-rose-800"   },
  "ramadan":    { bg: "bg-orange-100", text: "text-orange-800" },
  "dawah":      { bg: "bg-teal-100",   text: "text-teal-800"   },
  "janna-nar":  { bg: "bg-red-100",    text: "text-red-800"    },
  "tawba":      { bg: "bg-cyan-100",   text: "text-cyan-800"   },
  // Fatawa Categories (mapping their exact database slugs)
  "aqidah":        { bg: "bg-amber-50 border border-amber-100",   text: "text-amber-700"  },
  "tahara-salah":  { bg: "bg-teal-50 border border-teal-100",     text: "text-teal-700"   },
  "zakat-siyam":   { bg: "bg-emerald-50 border border-emerald-100", text: "text-emerald-700"},
  "muamalat":      { bg: "bg-cyan-50 border border-cyan-100",     text: "text-cyan-700"   },
  "usra":          { bg: "bg-rose-50 border border-rose-100",     text: "text-rose-700"   },
  "atima":         { bg: "bg-orange-50 border border-orange-100", text: "text-orange-700" },
  "adab":          { bg: "bg-sky-50 border border-sky-100",       text: "text-sky-700"    },
  "quran-tafsir":  { bg: "bg-purple-50 border border-purple-100", text: "text-purple-700" },
  "dawah-tarbiya": { bg: "bg-indigo-50 border border-indigo-100", text: "text-indigo-700" },
  "tibb":          { bg: "bg-violet-50 border border-violet-100", text: "text-violet-700" },
  "nisaa":         { bg: "bg-fuchsia-50 border border-fuchsia-100", text: "text-fuchsia-700" },
};

export function getCategoryColor(slug: string | null) {
  if (!slug) return { bg: "bg-gray-100", text: "text-gray-600" };
  return colors[slug] ?? { bg: "bg-gray-100", text: "text-gray-600" };
}