import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteFatawaCategory } from "@/lib/queries/fatawa";

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await deleteFatawaCategory(Number(id));
  return NextResponse.json({ success: true });
}