import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isRead } = await req.json();

    await db
      .update(reports)
      .set({ isRead })
      .where(eq(reports.id, Number(params.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(reports).where(eq(reports.id, Number(params.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
