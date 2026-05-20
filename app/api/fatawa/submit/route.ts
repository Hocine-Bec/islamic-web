import { NextRequest, NextResponse } from "next/server";
import { createFatwa } from "@/lib/queries/fatawa";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const { question, questionerName, isAnonymous } = await req.json();

  if (!question?.trim()) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  const slug =
    slugify(question.slice(0, 60), { lower: true, strict: true }) +
    "-" +
    Date.now().toString(36);

  const f = await createFatwa({
    slug,
    question,
    questionerName: isAnonymous ? undefined : questionerName,
    isAnonymous: isAnonymous ?? false,
    status: "pending",
  });

  return NextResponse.json(f);
}