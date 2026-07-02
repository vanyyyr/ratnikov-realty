import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:../db/custom.db",
});

async function sendReminder(botToken: string, chatId: string, text: string) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function checkReminders() {
  const now = new Date();
  const reminders: string[] = [];

  // 1. Stale leads (new, older than 24h)
  const staleLeads = await db.lead.findMany({
    where: {
      status: "new",
      createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "asc" },
  });

  for (const lead of staleLeads) {
    const hoursAgo = Math.floor((now.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60));
    reminders.push(`📋 <b>Необработанный лид</b>: ${lead.name} (${lead.phone}) — ${hoursAgo}ч назад`);
  }

  // 2. Overdue tasks
  const overdueTasks = await db.task.findMany({
    where: {
      status: { not: "completed" },
      dueDate: { lt: now },
    },
    orderBy: { dueDate: "asc" },
  });

  for (const task of overdueTasks) {
    if (!task.dueDate) continue;
    const daysOverdue = Math.floor((now.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60 * 24));
    reminders.push(`⏰ <b>Просроченная задача</b>: ${task.title} — на ${daysOverdue}дн просрочена`);
  }

  // 3. Stale deals (no stage change in 7+ days)
  const staleDeals = await db.deal.findMany({
    where: {
      stage: { notIn: ["closed_won", "closed_lost"] },
      updatedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    },
    include: { client: true },
    orderBy: { updatedAt: "asc" },
  });

  for (const deal of staleDeals) {
    const daysStale = Math.floor((now.getTime() - deal.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    reminders.push(`🏠 <b>Застоявшаяся сделка</b>: ${deal.title} (${deal.client.name}) — ${daysStale}дн без движения`);
  }

  if (reminders.length === 0) return;

  // Get Telegram settings
  const botTokenSetting = await db.setting.findUnique({ where: { key: "telegram_bot_token" } });
  const chatIdSetting = await db.setting.findUnique({ where: { key: "telegram_chat_id" } });

  if (!botTokenSetting?.value || !chatIdSetting?.value) {
    console.log(`[${now.toISOString()}] Reminders found (${reminders.length}) but Telegram not configured`);
    return;
  }

  const header = `🔔 <b>CRM Напоминания</b> (${reminders.length})\n${"─".repeat(20)}\n\n`;
  const text = header + reminders.join("\n\n");

  const ok = await sendReminder(botTokenSetting.value, chatIdSetting.value, text);
  console.log(`[${now.toISOString()}] Sent ${reminders.length} reminders to Telegram: ${ok ? "OK" : "FAILED"}`);
}

// Run every 30 minutes
const INTERVAL_MS = 30 * 60 * 1000;

console.log(`[reminder-service] Starting on port 3099, checking every ${INTERVAL_MS / 1000}s`);

// Health check server
const server = Bun.serve({
  port: 3099,
  fetch() {
    return new Response(JSON.stringify({ status: "ok", service: "reminder-service" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});

// Initial check after 10 seconds, then every 30 minutes
setTimeout(() => {
  checkReminders().catch((err) => console.error("Reminder check error:", err));
  setInterval(() => {
    checkReminders().catch((err) => console.error("Reminder check error:", err));
  }, INTERVAL_MS);
}, 10_000);

// Prevent process from exiting
process.on("SIGTERM", () => {
  console.log("[reminder-service] Shutting down");
  server.stop();
  process.exit(0);
});