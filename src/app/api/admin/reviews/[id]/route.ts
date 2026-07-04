import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT — update review
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, text, rating, source, isHidden, sortOrder } = body;

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: "Имя и текст отзыва обязательны" },
      { status: 400 }
    );
  }

  const review = await db.review.update({
    where: { id },
    data: {
      name: name.trim(),
      text: text.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      source: source || "manual",
      isHidden: Boolean(isHidden),
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(review);
}

// DELETE — remove review
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}