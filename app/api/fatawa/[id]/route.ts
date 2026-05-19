import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFatawaById, updateFatwa, deleteFatwa } from "@/lib/queries/fatawa";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const f = await getFatawaById(Number(id));
  if (!f) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(f);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  const f = await updateFatwa(Number(id), data);
  return NextResponse.json(f);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteFatwa(Number(id));
  return NextResponse.json({ success: true });
}