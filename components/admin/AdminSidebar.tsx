"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  FolderOpen,
  ScrollText,
  Tag,
  MessageSquare,
  LogOut,
  AlertTriangle,
} from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "الرئيسية", icon: Home },
  { href: "/admin/dashboard/posts", label: "الدروس", icon: BookOpen },
  { href: "/admin/dashboard/categories", label: "تصنيفات الدروس", icon: FolderOpen },
  { href: "/admin/dashboard/fatawa", label: "الفتاوى", icon: ScrollText, showPendingBadge: true },
  { href: "/admin/dashboard/fatawa-categories", label: "تصنيفات الفتاوى", icon: Tag },
  { href: "/admin/dashboard/comments", label: "التعليقات", icon: MessageSquare, showCommentBadge: true },
  { href: "/admin/dashboard/reports", label: "البلاغات", icon: AlertTriangle, showReportBadge: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pendingFatawa, setPendingFatawa] = useState(0);
  const [pendingComments, setPendingComments] = useState(0);
  const [unreadReports, setUnreadReports] = useState(0);

  useEffect(() => {
    fetch("/api/fatawa")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPendingFatawa(data.filter((f: { status: string }) => f.status === "pending").length);
        }
      })
      .catch(() => { });

    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPendingComments(data.filter((c: { approved: boolean }) => !c.approved).length);
        }
      })
      .catch(() => { });

    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnreadReports(data.filter((r: { isRead: boolean }) => !r.isRead).length);
        }
      })
      .catch(() => { });
  }, [pathname]);

  return (
    <aside className="w-60 bg-white border-l border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="text-sm font-semibold text-green-700">لوحة التحكم</div>
        <div className="text-xs text-gray-400 mt-0.5">أبو العباس محمد رحيل</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const badge =
            link.showPendingBadge && pendingFatawa > 0
              ? pendingFatawa
              : link.showCommentBadge && pendingComments > 0
                ? pendingComments
                : link.showReportBadge && unreadReports > 0
                  ? unreadReports
                  : null;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
              <span className="flex-1">{link.label}</span>
              {badge && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={15} strokeWidth={1.5} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}