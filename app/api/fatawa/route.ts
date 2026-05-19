import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFatawa, createFatwa } from "@/lib/queries/fatawa";
import slugify from "slugify";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getAllFatawa();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, answer, questionerName, isAnonymous, categoryId, status } =
    await req.json();

  const slug =
    slugify(question.slice(0, 60), { lower: true, strict: true }) +
    "-" +
    Date.now().toString(36);

  const f = await createFatwa({
    slug,
    question,
    answer,
    questionerName,
    isAnonymous,
    categoryId: categoryId ? Number(categoryId) : undefined,
    status: status ?? "pending",
  });

  return NextResponse.json(f);
}