import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const status = new URL(req.url).searchParams.get("status");
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const properties = await db.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const { title, address, type, rooms, area, price, status, cianUrl, description } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const property = await db.property.create({
    data: {
      title,
      address: address || null,
      type: type || null,
      rooms: rooms || null,
      area: area || null,
      price: price || null,
      status: status || "available",
      cianUrl: cianUrl || null,
      description: description || null,
    },
  });
  return NextResponse.json(property, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const property = await db.property.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.address !== undefined && { address: data.address || null }),
      ...(data.type !== undefined && { type: data.type || null }),
      ...(data.rooms !== undefined && { rooms: data.rooms || null }),
      ...(data.area !== undefined && { area: data.area || null }),
      ...(data.price !== undefined && { price: data.price || null }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.cianUrl !== undefined && { cianUrl: data.cianUrl || null }),
      ...(data.description !== undefined && { description: data.description || null }),
    },
  });
  return NextResponse.json(property);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}