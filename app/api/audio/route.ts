import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAudioFile } from "@/lib/queries/audio";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, title, url, order } = await req.json();
    const item = await createAudioFile({ postId: Number(postId), title, url, order });
    return NextResponse.json(item);
}
