import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT — update case
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, text, result, isHidden, sortOrder } = body;

  if (!title?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: "Название и описание обязательны" },
      { status: 400 }
    );
  }

  const caseItem = await db.case.update({
    where: { id },
    data: {
      title: title.trim(),
      text: text.trim(),
      result: result?.trim() || null,
      isHidden: Boolean(isHidden),
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(caseItem);
}

// DELETE — remove case
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.case.delete({ where: { id } });
  return NextResponse.json({ success: true });
}