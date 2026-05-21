import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/queries/posts";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllComments } from "@/lib/queries/comments";
import { getAllFatawa, getAllFatawaCategories } from "@/lib/queries/fatawa";
import Link from "next/link";
import {
  BookOpen,
  FolderOpen,
  ScrollText,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

async function StatsGrid() {
  const [posts, categories, fatawa, fatawaCategories, comments] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllFatawa(),
    getAllFatawaCategories(),
    getAllComments(),
  ]);

  const pendingFatawa = fatawa.filter((f) => f.status === "pending");
  const pendingComments = comments.filter((c) => !c.approved);

  const stats = [
    {
      label: "الدروس المنشورة",
      value: posts.filter((p) => p.status === "published").length,
      sub: "درساً ومحاضرة",
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "التصنيفات",
      value: categories.length + fatawaCategories.length,
      sub: "للدروس والفتاوى",
      icon: FolderOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "فتاوى بانتظار الإجابة",
      value: pendingFatawa.length,
      sub: "تحتاج إلى ردّ",
      icon: ScrollText,
      color: "text-amber-600",
      bg: "bg-amber-50",
      highlight: pendingFatawa.length > 0,
    },
    {
      label: "تعليقات معلقة",
      value: pendingComments.length,
      sub: "بانتظار المراجعة",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`bg-white border rounded-xl p-4 ${stat.highlight
              ? "border-amber-200 bg-amber-50"
              : "border-gray-100"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon size={15} className={stat.color} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-800">
              {stat.value}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

async function DashboardActivity() {
  const [fatawa, comments] = await Promise.all([
    getAllFatawa(),
    getAllComments(),
  ]);

  const pendingFatawa = fatawa.filter((f) => f.status === "pending");
  const pendingComments = comments.filter((c) => !c.approved);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Pending fatawa */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock size={13} className="text-amber-500" />
            فتاوى بانتظار الإجابة
          </div>
          <Link
            href="/admin/dashboard/fatawa"
            className="text-[10px] text-green-600 hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft size={10} />
          </Link>
        </div>
        {pendingFatawa.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-gray-400">
            لا توجد فتاوى معلقة 🎉
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingFatawa.slice(0, 4).map((f) => (
              <Link
                key={f.id}
                href={`/admin/dashboard/fatawa/${f.id}/edit`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 line-clamp-1 leading-relaxed">
                    {f.question}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {f.isAnonymous ? "سائل مجهول" : f.questionerName ?? "—"}
                    {" · "}
                    {new Date(f.createdAt!).toLocaleDateString("ar-DZ")}
                  </p>
                </div>
                <span className="text-[10px] text-green-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                  أجب ←
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pending comments */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MessageSquare size={13} className="text-blue-500" />
            تعليقات بانتظار المراجعة
          </div>
          <Link
            href="/admin/dashboard/comments"
            className="text-[10px] text-green-600 hover:underline flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft size={10} />
          </Link>
        </div>
        {pendingComments.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-gray-400">
            لا توجد تعليقات معلقة 🎉
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingComments.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href="/admin/dashboard/comments"
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 line-clamp-1 leading-relaxed">
                    {c.content}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {c.authorName}
                    {" · "}
                    {c.postTitle ?? "—"}
                  </p>
                </div>
                <span className="text-[10px] text-green-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                  راجع ←
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function RecentPostsSection() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 4);

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <CheckCircle size={13} className="text-green-500" />
          أحدث الدروس المنشورة
        </div>
        <Link
          href="/admin/dashboard/posts"
          className="text-[10px] text-green-600 hover:underline flex items-center gap-1"
        >
          إدارة الدروس
          <ArrowLeft size={10} />
        </Link>
      </div>
      <div className="divide-y divide-gray-50">
        {recentPosts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/dashboard/posts/${post.id}/edit`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 line-clamp-1">{post.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {post.categoryName ?? "بدون تصنيف"}
                {" · "}
                {new Date(post.createdAt!).toLocaleDateString("ar-DZ")}
              </p>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${post.status === "published"
                ? "bg-green-50 text-green-600"
                : "bg-yellow-50 text-yellow-600"
                }`}
            >
              {post.status === "published" ? "منشور" : "مسودة"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const today = new Date().toLocaleDateString("ar-DZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8 max-w-5xl" dir="rtl">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            مرحباً بك يا شيخ 👋
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            إليك ملخص آخر التحديثات على الموقع
          </p>
        </div>
        <div className="text-xs text-gray-500 bg-white border border-gray-100 px-3 py-2 rounded-lg">
          {today}
        </div>
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>}>
        <StatsGrid />
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
      </div>}>
        <DashboardActivity />
      </Suspense>

      <Suspense fallback={<div className="h-48 bg-gray-50 rounded-xl animate-pulse" />}>
        <RecentPostsSection />
      </Suspense>
    </div>
  );
}
