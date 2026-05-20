import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, type, details } = body;

    if (!postId || !type || !details) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [report] = await db
      .insert(reports)
      .values({
        postId,
        type,
        details,
      })
      .returning();

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { posts } = await import("@/db/schema");

    const allReports = await db
      .select({
        id: reports.id,
        postId: reports.postId,
        type: reports.type,
        details: reports.details,
        isRead: reports.isRead,
        createdAt: reports.createdAt,
        postTitle: posts.title,
      })
      .from(reports)
      .leftJoin(posts, eq(reports.postId, posts.id))
      .orderBy(desc(reports.createdAt));

    return NextResponse.json(allReports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
