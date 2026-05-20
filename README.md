# 📖 الموقع العلمي للشيخ أبو العباس محمد رحيل (Islamic Web Platform)

موقع إسلامي علمي متكامل مخصص لنشر الدروس والمحاضرات الشرعية، الفتاوى الفقهية، وإدارة شؤون المحتوى العلمي والمراجعة الشرعية عبر لوحة تحكم متطورة وآمنة.

A premium, comprehensive Islamic educational and fatwa platform built with a modern web stack, featuring robust admin dashboards, audio management, and mistake reporting systems.

---

## ✨ المميزات الرئيسية / Key Features

### 🌐 الواجهة العامة (Public Interface)
* **دروس ومحاضرات علمية:** عرض متقن ومصنف للمحاضرات والدروس الشرعية مع دعم كامل لمحرر النصوص التفاعلي (Rich Text).
* **قسم الفتاوى الشرعية:** مساحة مخصصة لعرض الفتاوى مقسمة حسب الأبواب الفقهية الكبرى مع تمييز لوني ديناميكي وجذاب لكل قسم.
* **نظام تشغيل الصوتيات:** قارئ صوتيات متطور ومدمج للاستماع إلى الشروحات والفتاوى المسجلة مباشرة.
* **الإبلاغ عن الأخطاء (Report Mistake):** إمكانية إرسال بلاغات فورية من قبل الزوار عن أي خطأ علمي، إملائي، أو مطبعي في الدروس والفتاوى لضمان سلامة المحتوى العلمي.

### 🔐 لوحة التحكم الإدارية (Admin Dashboard)
* **إدارة الدروس والفتاوى:** نظام CRUD (إنشاء، قراءة، تحديث، حذف) متطور وحديث لإدارة الدروس والفتاوى وتصنيفاتها.
* **نظام الصوتيات الذكي (Save-then-Attach):** رفع وإلحاق الملفات الصوتية بالدروس والفتاوى بالاعتماد على **UploadThing (v7)**.
* **مركز إدارة البلاغات (Balaaghaat):** لوحة متكاملة لمشاهدة بلاغات الأخطاء الواردة من الزوار، وتحديد حالتها (مقروء/غير مقروء/تمت معالجته) مع تنبيهات حية (Unread Badge) في القائمة الجانبية للإدارة.
* **إدارة التعليقات:** مراجعة وحذف تعليقات الزوار على الدروس لضمان بقاء المناقشات علمية وهادفة.

---

## 🛠️ التقنيات المستخدمة / Tech Stack

* **الإطار الأساسي (Framework):** [Next.js 15+ (App Router)](https://nextjs.org/)
* **لغة البرمجة (Language):** [TypeScript](https://www.typescriptlang.org/)
* **قاعدة البيانات (Database):** [SQLite / LibSQL](https://turso.tech/) (عبر منصة Turso السحابية)
* **مخطط ومحرك الاستعلامات (ORM):** [Drizzle ORM](https://orm.drizzle.team/)
* **التصميم والتنسيق (Styling):** [Tailwind CSS](https://tailwindcss.com/) مع استخدام تأثيرات الزجاج البلوري (Glassmorphism) وتصميم متجاوب بالكامل.
* **رفع وإدارة الملفات (Uploads):** [UploadThing SDK v7](https://uploadthing.com/)
* **محرر النصوص (Rich Text Editor):** [Tiptap Editor](https://tiptap.dev/)

---

## 📂 هيكلية المشروع / Project Structure

```bash
├── app/                      # مسارات Next.js (App Router)
│   ├── (admin-group)/        # صفحات لوحة التحكم الإدارية المؤمّنة
│   │   └── admin/dashboard/  # صفحات الإدارة (الدروس، الفتاوى، البلاغات، التعليقات)
│   ├── (public)/             # الصفحات العامة المتاحة للزوار
│   │   ├── posts/            # عرض الدروس وتفاصيلها
│   │   └── fatawa/           # عرض الفتاوى وتفاصيلها
│   └── api/                  # المعالجات الخلفية والـ API Endpoints
├── components/               # المكونات المشتركة
│   ├── admin/                # مكونات لوحة التحكم (Sidebar, Dialogs, Toast, etc.)
│   └── public/               # مكونات الواجهة العامة (AudioPlayer, ReportMistake, etc.)
├── db/                       # مخطط قاعدة البيانات (Schema) والهجرات
├── lib/                      # ملفات المساعدة، الاتصال بقاعدة البيانات، الاستعلامات، وأدوات البذر
│   ├── queries/              # استعلامات Drizzle الجاهزة (Posts, Fatawa, Reports, etc.)
│   └── seed.ts               # سكربت بذر قاعدة البيانات بالبيانات الأولية
```

---

## 🚀 البدء والتشغيل / Getting Started

### 1. إعداد المتغيرات البيئية (Environment Variables)
قم بإنشاء ملف باسم `.env.local` في الجذر الرئيسي للمشروع، وأضف البيانات التالية:

```env
# اتصال قاعدة البيانات (Turso / SQLite)
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# المصادقة (NextAuth)
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# بيانات المشرف الافتراضي (يمكنك تعديلها)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password_here

# رفع الملفات (Uploadthing)
UPLOADTHING_TOKEN=your_uploadthing_token
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
# أو
pnpm install
```

### 3. تهيئة ومزامنة قاعدة البيانات (Database Sync & Seeding)
لمزامنة الجداول والمخطط الجديد (بما فيها جدول البلاغات والفتاوى الموسّع) مع قاعدة البيانات:
```bash
npx drizzle-kit push
```

لبذر قاعدة البيانات بالبيانات العلمية والافتراضية الموسعة (دروس، فتاوى، تصنيفات مع تحويل تلقائي للـ HTML):
```bash
npx tsx lib/seed.ts
```

### 4. تشغيل خادم التطوير (Run Development Server)
```bash
npm run dev
```
افتح الرابط [http://localhost:3000](http://localhost:3000) في متصفحك لتصفح المنصة.

---

## 🔒 الأمان والمراجعة العلمية

* جميع لوحات ومسارات الإدارة محمية بالكامل خلف طبقة حماية للمشرفين (Middleware + Session Verification).
* تم دمج خيار **الإبلاغ عن الأخطاء** في أسفل كل مادة علمية ليتيح للطلبة والقراء تنبيه الإدارة فورياً بأي ملحوظة، مما يعزز دقة وموثوقية المنصة الشرعية.

---

## 📄 الترخيص / License

هذا المشروع متاح للاستخدام الشخصي والتطوير العلمي.
This project is open for personal use and educational development.
