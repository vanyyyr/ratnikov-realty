import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification } from "@/lib/notifications";

interface ReminderItem {
  type: "stale_lead" | "overdue_task" | "stale_deal";
  itemId: string;
  title: string;
  message: string;
  suggestedAction: string;
  createdAt?: Date;
  dueDate?: Date;
}

export async function GET(req: NextRequest) {
  try {
    const send = new URL(req.url).searchParams.get("send") === "true";
    const reminders: ReminderItem[] = [];

    // 1. Leads with status "new" created more than 24 hours ago
    const staleLeads = await db.lead.findMany({
      where: {
        status: "new",
        createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "asc" },
    });

    for (const lead of staleLeads) {
      const hoursAgo = Math.floor(
        (Date.now() - lead.createdAt.getTime()) / (1000 * 60 * 60)
      );
      reminders.push({
        type: "stale_lead",
        itemId: lead.id,
        title: `Необработанный лид: ${lead.name}`,
        message: `Лид "${lead.name}" (${lead.phone}) ожидает связи уже ${hoursAgo} ч.`,
        suggestedAction: "Связаться с лидом и изменить статус",
        createdAt: lead.createdAt,
      });
    }

    // 2. Tasks with dueDate in the past and status != "completed"
    const overdueTasks = await db.task.findMany({
      where: {
        status: { not: "completed" },
        dueDate: { lt: new Date() },
      },
      orderBy: { dueDate: "asc" },
    });

    for (const task of overdueTasks) {
      if (!task.dueDate) continue;
      const daysOverdue = Math.floor(
        (Date.now() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      reminders.push({
        type: "overdue_task",
        itemId: task.id,
        title: `Просроченная задача: ${task.title}`,
        message: `Задача "${task.title}" просрочена на ${daysOverdue} дн.`,
        suggestedAction: "Выполнить задачу или изменить срок",
        createdAt: task.createdAt,
        dueDate: task.dueDate,
      });
    }

    // 3. Deals that haven't moved stages in 7+ days (check updatedAt)
    const staleDeals = await db.deal.findMany({
      where: {
        stage: { notIn: ["closed_won", "closed_lost"] },
        updatedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: { client: true },
      orderBy: { updatedAt: "asc" },
    });

    for (const deal of staleDeals) {
      const daysStale = Math.floor(
        (Date.now() - deal.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      reminders.push({
        type: "stale_deal",
        itemId: deal.id,
        title: `Застоявшаяся сделка: ${deal.title}`,
        message: `Сделка "${deal.title}" (${deal.client.name}) не двигается ${daysStale} дн. Стадия: ${deal.stage}.`,
        suggestedAction: "Проконтактировать клиента или изменить стадию сделки",
        createdAt: deal.createdAt,
      });
    }

    // Send notifications if requested
    if (send && reminders.length > 0) {
      const totalText = reminders
        .slice(0, 10)
        .map((r) => `• ${r.title}: ${r.message}`)
        .join("\n");

      await sendNotification({
        type: "task_reminder",
        title: `🔔 Напоминания (${reminders.length})`,
        message: totalText,
      });
    }

    return NextResponse.json({ reminders, total: reminders.length });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}