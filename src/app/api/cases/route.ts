import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint — returns visible cases sorted by sortOrder
export async function GET() {
  const cases = await db.case.findMany({
    where: { isHidden: false },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(cases);
}