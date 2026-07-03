import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET — all reviews (including hidden), sorted
export async function GET() {
  const reviews = await db.review.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(reviews);
}

// POST — create review
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, text, rating, source, isHidden, sortOrder } = body;

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: "Имя и текст отзыва обязательны" },
      { status: 400 }
    );
  }

  const review = await db.review.create({
    data: {
      name: name.trim(),
      text: text.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      source: source || "manual",
      isHidden: Boolean(isHidden),
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(review, { status: 201 });
}