import { NextRequest, NextResponse } from "next/server";
import { getAudioByPost } from "@/lib/queries/audio";

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;
    const data = await getAudioByPost(Number(postId));
    return NextResponse.json(data);
}