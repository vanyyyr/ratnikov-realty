import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tasks = await db.task.findMany({
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const { title, description, priority, dueDate, clientName } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const task = await db.task.create({
    data: {
      title,
      description: description || null,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      clientName: clientName || null,
    },
  });
  return NextResponse.json(task, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description || null;
  if (data.priority !== undefined) update.priority = data.priority;
  if (data.dueDate !== undefined) update.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.clientName !== undefined) update.clientName = data.clientName || null;
  if (data.status !== undefined) {
    update.status = data.status;
    if (data.status === "completed") update.completedAt = new Date();
  }
  const task = await db.task.update({ where: { id }, data: update });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}