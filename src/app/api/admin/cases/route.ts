import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — all cases (including hidden), sorted
export async function GET() {
  const cases = await db.case.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(cases);
}

// POST — create case
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, text, result, isHidden, sortOrder } = body;

  if (!title?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: "Название и описание обязательны" },
      { status: 400 }
    );
  }

  const caseItem = await db.case.create({
    data: {
      title: title.trim(),
      text: text.trim(),
      result: result?.trim() || null,
      isHidden: Boolean(isHidden),
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(caseItem, { status: 201 });
}