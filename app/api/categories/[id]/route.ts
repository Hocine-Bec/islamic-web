import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateCategory, deleteCategory } from "@/lib/queries/categories";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const category = await updateCategory(Number(id), data);
  return NextResponse.json(category);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteCategory(Number(id));
  return NextResponse.json({ success: true });
}
