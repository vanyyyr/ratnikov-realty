import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const leadId = new URL(req.url).searchParams.get("leadId");
  const where: Record<string, unknown> = {};
  if (leadId) where.leadId = leadId;

  const tasks = await db.task.findMany({
    where,
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      lead: { select: { id: true, name: true } },
      deal: { select: { id: true, title: true } },
    },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const { title, description, priority, dueDate, clientName, leadId, dealId } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const task = await db.task.create({
    data: {
      title,
      description: description || null,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      clientName: clientName || null,
      leadId: leadId || null,
      dealId: dealId || null,
    },
  });
  await logActivity("task_created", `Новая задача: ${title}`);
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
  if (data.leadId !== undefined) update.leadId = data.leadId || null;
  if (data.dealId !== undefined) update.dealId = data.dealId || null;
  if (data.status !== undefined) {
    update.status = data.status;
    if (data.status === "completed") {
      update.completedAt = new Date();
      await logActivity("task_completed", `Задача выполнена: ${id}`);
    } else {
      await logActivity("task_updated", `Задача обновлена: ${id}, статус: ${data.status}`);
    }
  }
  const task = await db.task.update({
    where: { id },
    data: update,
    include: {
      lead: { select: { id: true, name: true } },
      deal: { select: { id: true, title: true } },
    },
  });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}