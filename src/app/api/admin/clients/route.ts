import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const search = new URL(req.url).searchParams.get("search");
  const tagsParam = new URL(req.url).searchParams.get("tags");
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (tagsParam) {
    const tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
    if (tags.length > 0) {
      const tagConditions = tags.map((tag) => ({
        tags: { contains: `"${tag}"` },
      }));
      if (tagConditions.length === 1) {
        where.tags = tagConditions[0].tags;
      } else {
        const existingOr = where.OR as Array<Record<string, unknown>> | undefined;
        where.OR = [
          ...(existingOr || []),
          ...tagConditions,
        ];
      }
    }
  }
  const clients = await db.client.findMany({
    where,
    include: { deals: true, lead: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const { name, phone, email, telegram, notes, leadId, tags, telegramHandle, maxId, source } = await req.json();
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
      tags: tags ? (typeof tags === "string" ? tags : JSON.stringify(tags)) : null,
      telegramHandle: telegramHandle || null,
      maxId: maxId || null,
      source: source || null,
    },
  });
  await logActivity("client_created", `Новый клиент: ${name}, ${phone}`);
  return NextResponse.json(client, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email || null;
  if (data.telegram !== undefined) updateData.telegram = data.telegram || null;
  if (data.notes !== undefined) updateData.notes = data.notes || null;
  if (data.tags !== undefined) {
    updateData.tags = typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags);
  }
  if (data.telegramHandle !== undefined) updateData.telegramHandle = data.telegramHandle || null;
  if (data.maxId !== undefined) updateData.maxId = data.maxId || null;
  if (data.source !== undefined) updateData.source = data.source || null;
  const client = await db.client.update({
    where: { id },
    data: updateData,
  });
  await logActivity("client_updated", `Клиент обновлён: ${client.name}`);
  return NextResponse.json(client);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const client = await db.client.findUnique({ where: { id } });
  await db.client.delete({ where: { id } });
  if (client) {
    await logActivity("client_deleted", `Клиент удалён: ${client.name}`);
  }
  return NextResponse.json({ success: true });
}