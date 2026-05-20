
export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/queries/posts";
import { getAllCategories } from "@/lib/queries/categories";
import { getAllComments } from "@/lib/queries/comments";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const WHATSAPP = "https://wa.me/213XXXXXXXXX";
const EMAIL = "mailto:contact@example.com";
const TELEGRAM = "https://t.me/username";

export default async function HomePage() {
  const [posts, categories, comments] = await Promise.all([
    getPublishedPosts(),
    getAllCategories(),
    getAllComments(),
  ]);

  const latestPosts = posts.slice(0, 5);
  const [featured, ...rest] = latestPosts;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
      <PublicHeader />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-green-700 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 24px,white 24px,white 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,white 24px,white 25px)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-6 py-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white/90 text-xs px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 flex-shrink-0" />
              تنشر الدروس أسبوعياً — تابع وانتفع
            </div>
            <h1 className="text-white text-2xl font-medium leading-relaxed mb-2">
              أبو العباس محمد رحيل بن إسماعيل
            </h1>
            <p className="text-white/70 text-sm mb-8">
              دروس في العقيدة والفقه والحديث والسيرة النبوية على منهج السلف الصالح
            </p>
            <div className="flex justify-center">
              <div className="flex items-center divide-x divide-x-reverse divide-white/20">
                {[
                  { num: posts.length, label: "درساً ومحاضرة" },
                  { num: categories.length, label: "تصنيفاً علمياً" },
                  { num: comments.length, label: "مشاركة وتعليق" },
                ].map((s) => (
                  <div key={s.label} className="text-center px-8">
                    <div className="text-white text-2xl font-medium">{s.num}</div>
                    <div className="text-white/60 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* ── Categories ── */}
          {categories.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-0.5 h-4 bg-green-700 rounded-full" />
                <h2 className="text-sm font-medium text-gray-800">التصنيفات</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/posts?category=${cat.slug}`}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700 text-gray-500 px-4 py-1.5 rounded-full text-xs transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Latest Posts ── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-0.5 h-4 bg-green-700 rounded-full" />
                <h2 className="text-sm font-medium text-gray-800">أحدث الدروس</h2>
              </div>
              <Link href="/posts" className="text-xs text-green-600 hover:underline">
                عرض الكل ←
              </Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-400 text-center py-12">لا توجد دروس بعد</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Featured post */}
                {featured && (
                  <Link
                    href={`/posts/${featured.slug}`}
                    className="md:col-span-2 flex gap-4 items-start bg-green-50 border border-green-200 rounded-xl p-5 hover:border-green-400 transition"
                  >
                    <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 mt-0.5">
                      📖
                    </div>
                    <div className="flex-1 min-w-0">
                      {featured.categoryName && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          {featured.categoryName}
                        </span>
                      )}
                      <h3 className="font-medium text-gray-800 mt-2 mb-1.5 text-base leading-relaxed">
                        {featured.title}
                      </h3>
                      {featured.excerpt && (
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {new Date(featured.createdAt!).toLocaleDateString("ar-DZ")}
                        </span>
                        <span className="text-xs text-green-700">← اقرأ الدرس</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Rest of posts */}
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-sm transition block"
                  >
                    {post.categoryName && (
                      <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        {post.categoryName}
                      </span>
                    )}
                    <h3 className="font-medium text-gray-800 mt-2 mb-1.5 text-sm leading-relaxed">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">
                        {new Date(post.createdAt!).toLocaleDateString("ar-DZ")}
                      </span>
                      <span className="text-xs text-green-600">←</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ── Contact Card ── */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-0.5 h-4 bg-green-700 rounded-full" />
              <h2 className="text-sm font-medium text-gray-800">تواصل مع الشيخ</h2>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              {/* Card header */}
              <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full border-2 border-green-100 bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="الشيخ"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    أبو العباس محمد رحيل بن إسماعيل
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    طالب علم — داعية إسلامي
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-5 text-xs text-gray-500 leading-relaxed">
                <span className="text-green-700 font-medium">ملاحظة: </span>
                يُرجى صياغة سؤالك بوضوح وذكر المسألة كاملة. يُفضَّل التواصل عبر واتساب أو تيليغرام للأسئلة الشرعية، وعبر البريد الإلكتروني للمراسلات الرسمية.
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 bg-green-50 border border-green-100 hover:border-green-300 rounded-xl py-4 px-2 transition"
                >
                  <span className="text-2xl">📱</span>
                  <span className="text-xs font-medium text-green-700">واتساب</span>
                </a>
                <a
                  href={EMAIL}
                  className="flex flex-col items-center gap-1.5 bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl py-4 px-2 transition"
                >
                  <span className="text-2xl">✉️</span>
                  <span className="text-xs font-medium text-blue-700">البريد الإلكتروني</span>
                </a>
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 bg-sky-50 border border-sky-100 hover:border-sky-300 rounded-xl py-4 px-2 transition"
                >
                  <span className="text-2xl">✈️</span>
                  <span className="text-xs font-medium text-sky-700">تيليغرام</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}