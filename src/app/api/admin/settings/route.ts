import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setAdminPassword } from "@/lib/auth";
import { sendTelegramNotification, sendMaxNotification, logActivity } from "@/lib/notifications";

const SETTINGS_KEYS = [
  "telegram_bot_token",
  "telegram_chat_id",
  "max_webhook_url",
  "social_telegram",
  "social_vk",
  "social_instagram",
  "social_whatsapp",
  "yandex_metrika_id",
  "cian_profile_url",
  "phone",
  "address",
  "max_profile_url",
];

export async function GET() {
  const settings = await db.setting.findMany({
    where: { key: { in: SETTINGS_KEYS } },
  });
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return NextResponse.json(map);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  // Handle password change
  if (body.adminPassword) {
    const currentPassword = body.currentPassword;
    const { verifyAdmin } = await import("@/lib/auth");
    if (currentPassword) {
      const valid = await verifyAdmin(currentPassword);
      if (!valid) {
        return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 401 });
      }
    }
    await setAdminPassword(body.adminPassword);
    delete body.adminPassword;
    delete body.currentPassword;
  }

  // Save settings
  for (const [key, value] of Object.entries(body)) {
    if (SETTINGS_KEYS.includes(key)) {
      await db.setting.upsert({
        where: { key },
        update: { value: String(value || "") },
        create: { key, value: String(value || "") },
      });
    }
  }

  // Handle test notifications
  if (body._test === "telegram") {
    delete body._test;
    // Save token/chat_id first, then send test
    const tgOk = await sendTelegramNotification({
      type: "test",
      title: "Тестовое уведомление",
      message: "Настройки Telegram подключены успешно! ✓",
    });
    await logActivity("test_notification", "Тестовое уведомление в Telegram: " + (tgOk ? "успешно" : "ошибка"));
    if (!tgOk) {
      return NextResponse.json({ error: "Не удалось отправить. Проверьте токен и Chat ID." }, { status: 400 });
    }
  }

  if (body._test === "max") {
    delete body._test;
    const mxOk = await sendMaxNotification({
      type: "test",
      title: "Тестовое уведомление",
      message: "Настройки Max webhook подключены успешно!",
    });
    await logActivity("test_notification", "Тестовое уведомление в Max: " + (mxOk ? "успешно" : "ошибка"));
    if (!mxOk) {
      return NextResponse.json({ error: "Не удалось отправить. Проверьте URL вебхука." }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true });
}