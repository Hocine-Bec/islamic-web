import { NextRequest, NextResponse } from "next/server";
import { getAudioByFatwa } from "@/lib/queries/fatawa";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ fatawaId: string }> }
) {
  const { fatawaId } = await params;
  const audio = await getAudioByFatwa(Number(fatawaId));
  return NextResponse.json(audio);
}