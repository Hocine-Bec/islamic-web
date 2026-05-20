"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/posts", label: "الدروس" },
  { href: "/fatawa", label: "الفتاوى" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="شعار الشيخ"
            width={72}
            height={72}
            className="object-contain"
          />
          <div>
            <div className="font-bold text-gray-800 text-sm leading-tight">
              أبو العباس محمد رحيل بن إسماعيل
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              دروس ومحاضرات إسلامية
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                pathname === link.href
                  ? "text-green-700 font-medium"
                  : "text-gray-500 hover:text-green-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}