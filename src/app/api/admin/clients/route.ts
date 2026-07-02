import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const search = new URL(req.url).searchParams.get("search");
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }
  const clients = await db.client.findMany({
    where,
    include: { deals: true, lead: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const { name, phone, email, telegram, notes, leadId } = await req.json();
  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
  }
  const client = await db.client.create({
    data: {
      name,
      phone,
      email: email || null,
      telegram: telegram || null,
      notes: notes || null,
      leadId: leadId || null,
    },
  });
  return NextResponse.json(client, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const client = await db.client.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email || null }),
      ...(data.telegram !== undefined && { telegram: data.telegram || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
  return NextResponse.json(client);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
}