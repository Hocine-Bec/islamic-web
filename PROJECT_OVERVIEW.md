# Islamic Web Project — أبو العباس محمد رحيل

This project is a dedicated Islamic educational platform for **Abu Al-Abbas Muhammad Rahil bin Ismail**. It serves as a digital library for his lessons, lectures, and articles, providing a clean, accessible interface for students and seekers of knowledge.

## 🌟 Key Features

### Public-Facing Site
- **Homepage**: A modern, responsive landing page featuring the latest lessons and a quick overview of categories.
- **Lesson Library**: A full list of all published lessons with pagination support.
- **Category Navigation**: Lessons are organized into specific Islamic sciences (e.g., Aqidah, Fiqh, Seerah, Tafsir).
- **Interactive Comments**: Students can leave comments on lessons, which appear after administrative approval.
- **Arabic First Design**: Fully localized in Arabic with RTL (Right-to-Left) support and appropriate typography.

### Admin Dashboard (Protected)
- **Statistics Overview**: Real-time stats on the number of lessons, categories, and pending comments.
- **Content Management (CRUD)**: Full control over creating, editing, and deleting lessons and categories.
- **Comment Moderation**: An approval system to manage user feedback and maintain a healthy learning environment.
- **Secure Authentication**: Protected admin area powered by NextAuth.js.

## 🛠️ Technical Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) (via [LibSQL/Turso](https://turso.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React Server Components & Hooks

## 📂 Project Structure

- `app/(public)`: All public-facing routes and pages.
- `app/(admin-group)`: Protected administrative routes.
- `app/api`: Backend API endpoints for content and comment management.
- `components/ui`: Reusable UI components.
- `db`: Database schema definitions and migrations.
- `lib/queries`: Abstracted database interaction logic (Query Helpers).

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Copy `.env.example` to `.env.local` and fill in your credentials.
3. **Database Migration**: `npx drizzle-kit push`
4. **Seed Data**: `npx tsx lib/seed.ts`
5. **Run Development Server**: `npm run dev`

---
*Created with the goal of spreading Islamic knowledge through modern technology.*
