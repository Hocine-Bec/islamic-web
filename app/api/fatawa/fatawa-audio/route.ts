import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createFatawaAudio } from "@/lib/queries/fatawa";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { fatawaId, title, url, order } = await req.json();
  const audio = await createFatawaAudio({ fatawaId, title, url, order });
  return NextResponse.json(audio);
}