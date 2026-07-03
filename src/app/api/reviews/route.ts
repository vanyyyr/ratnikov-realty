import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint — returns visible reviews sorted by sortOrder
export async function GET() {
  const reviews = await db.review.findMany({
    where: { isHidden: false },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      text: true,
      rating: true,
      source: true,
      createdAt: true,
    },
  });
  return NextResponse.json(reviews);
}