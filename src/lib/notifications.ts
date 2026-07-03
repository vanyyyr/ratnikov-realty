import { db } from "./db";

export interface NotificationPayload {
  type: "new_lead" | "new_deal" | "task_reminder" | "test" | string;
  title: string;
  message: string;
}

export async function logActivity(action: string, details?: string) {
  await db.activityLog.create({ data: { action, details } });
}

export async function sendTelegramNotification(payload: NotificationPayload) {
  const setting = await db.setting.findUnique({ where: { key: "telegram_bot_token" } });
  const chatSetting = await db.setting.findUnique({ where: { key: "telegram_chat_id" } });

  if (!setting?.value || !chatSetting?.value) return false;

  const token = setting.value;
  const chatId = chatSetting.value;

  const emoji = payload.type === "new_lead" ? "🆕" : payload.type === "new_deal" ? "🏠" : "🔔";
  const text = `${emoji} *${payload.title}*\n\n${payload.message}\n\n_${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}_`;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendMaxNotification(payload: NotificationPayload) {
  const setting = await db.setting.findUnique({ where: { key: "max_webhook_url" } });
  if (!setting?.value) return false;

  try {
    const res = await fetch(setting.value, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendNotification(payload: NotificationPayload) {
  const [tg, mx] = await Promise.all([
    sendTelegramNotification(payload),
    sendMaxNotification(payload),
  ]);
  return { telegram: tg, max: mx };
}