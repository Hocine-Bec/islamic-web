import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  categoryId: integer("category_id").references(() => categories.id),
  status: text("status", { enum: ["draft", "published"] }).default("draft"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
}, (table) => ({
  statusIdx: index("posts_status_idx").on(table.status),
  categoryIdx: index("posts_category_idx").on(table.categoryId),
  slugIdx: index("posts_slug_idx").on(table.slug),
}));

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  approved: integer("approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => ({
  postIdx: index("comments_post_idx").on(table.postId),
  approvedIdx: index("comments_approved_idx").on(table.approved),
}));

export const fatawaCategories = sqliteTable("fatawa_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const fatawa = sqliteTable("fatawa", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  question: text("question").notNull(),
  answer: text("answer"),
  questionerName: text("questioner_name"),
  isAnonymous: integer("is_anonymous", { mode: "boolean" }).default(false),
  categoryId: integer("category_id").references(() => fatawaCategories.id),
  status: text("status", { enum: ["pending", "published"] }).default("pending"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
}, (table) => ({
  statusIdx: index("fatawa_status_idx").on(table.status),
  categoryIdx: index("fatawa_category_idx").on(table.categoryId),
  slugIdx: index("fatawa_slug_idx").on(table.slug),
}));

export const audioFiles = sqliteTable("audio_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => ({
  postIdx: index("audio_post_idx").on(table.postId),
}));

export const fatawaAudio = sqliteTable("fatawa_audio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fatawaId: integer("fatawa_id")
    .notNull()
    .references(() => fatawa.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => ({
  fatawaIdx: index("fatawa_audio_fatawa_idx").on(table.fatawaId),
}));

// ─── Reports ──────────────────────────────────────────────────
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  details: text("details").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
}, (table) => ({
  postIdx: index("reports_post_idx").on(table.postId),
}));