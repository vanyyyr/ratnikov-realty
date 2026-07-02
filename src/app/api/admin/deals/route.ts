import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/notifications";

const STAGES = ["new", "showing", "negotiation", "contract", "closed_won", "closed_lost"];

export async function GET(req: NextRequest) {
  const stage = new URL(req.url).searchParams.get("stage");
  const where: Record<string, unknown> = {};
  if (stage && stage !== "all") where.stage = stage;

  const deals = await db.deal.findMany({
    where,
    include: { client: true, property: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(deals);
}

export async function POST(req: NextRequest) {
  const { title, clientId, value, stage, notes, propertyId } = await req.json();
  if (!title || !clientId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const deal = await db.deal.create({
    data: {
      title,
      clientId,
      value: value || null,
      stage: stage || "new",
      notes: notes || null,
      propertyId: propertyId || null,
    },
  });
  await logActivity("deal_created", `Сделка: ${title}`);
  return NextResponse.json(deal, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (data.title) update.title = data.title;
  if (data.clientId) update.clientId = data.clientId;
  if (data.value !== undefined) update.value = data.value;
  if (data.stage && STAGES.includes(data.stage)) {
    update.stage = data.stage;
    if (data.stage === "closed_won" || data.stage === "closed_lost") {
      update.closedAt = new Date();
    }
  }
  if (data.notes !== undefined) update.notes = data.notes;
  if (data.propertyId !== undefined) update.propertyId = data.propertyId;

  const deal = await db.deal.update({ where: { id }, data: update });
  await logActivity("deal_updated", `Сделка ${deal.title}: стадия ${deal.stage}`);
  return NextResponse.json(deal);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}