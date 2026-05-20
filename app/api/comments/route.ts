import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllComments } from "@/lib/queries/comments";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getAllComments();
  return NextResponse.json(data);
}
