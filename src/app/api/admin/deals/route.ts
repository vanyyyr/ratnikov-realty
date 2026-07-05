import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/notifications";

const STAGES = ["new", "showing", "negotiation", "contract", "closed_won", "closed_lost"];

export async function GET(req: NextRequest) {
  const stage = new URL(req.url).searchParams.get("stage");
  const limit = parseInt(new URL(req.url).searchParams.get("limit") || "100");
  const where: Record<string, unknown> = {};
  if (stage && stage !== "all") where.stage = stage;

  const deals = await db.deal.findMany({
    where,
    include: { client: true, property: true },
    orderBy: { updatedAt: "desc" },
    take: Math.min(limit, 500),
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

  // Fetch current deal to detect stage changes
  const currentDeal = await db.deal.findUnique({ where: { id } });
  if (!currentDeal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const update: Record<string, unknown> = {};
  if (data.title) update.title = data.title;
  // clientId: поддерживаем сброс связи (пустая строка / null)
  if (data.clientId !== undefined) {
    update.clientId = data.clientId || null;
  }
  if (data.value !== undefined) update.value = data.value;
  if (data.stage && STAGES.includes(data.stage)) {
    update.stage = data.stage;
    if (data.stage === "closed_won" || data.stage === "closed_lost") {
      update.closedAt = new Date();
    }
    // Auto-calculate commission when deal is closed_won
    if (data.stage === "closed_won") {
      const dealValue = data.value !== undefined ? data.value : currentDeal.value;
      if (dealValue != null) {
        const rateSetting = await db.setting.findUnique({ where: { key: "commission_rate" } });
        const rate = rateSetting ? parseFloat(rateSetting.value) || 3 : 3;
        update.commission = Math.round(dealValue * (rate / 100) * 100) / 100;
      }
    }
    // Log stage change
    if (currentDeal.stage !== data.stage) {
      await logActivity(
        "deal_stage_changed",
        `Сделка '${currentDeal.title}' переведена в стадию '${data.stage}' (было: '${currentDeal.stage}')`
      );
    }
  }
  if (data.notes !== undefined) update.notes = data.notes;
  if (data.propertyId !== undefined) {
    update.propertyId = data.propertyId || null;
  }

  const deal = await db.deal.update({ where: { id }, data: update });
  return NextResponse.json(deal);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.deal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}