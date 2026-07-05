import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setAdminPassword, verifyAdmin } from "@/lib/auth";
import {
  sendTelegramNotification,
  sendMaxNotification,
  logActivity,
} from "@/lib/notifications";

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
  "show_reviews",
  "show_cases",
  "show_stats",
  "commission_rate",
];

export async function GET() {
  try {
    const settings = await db.setting.findMany({
      where: { key: { in: SETTINGS_KEYS } },
    });
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return NextResponse.json(map);
  } catch {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Смена пароля: обязательная серверная проверка текущего пароля.
    if (body.adminPassword) {
      const currentPassword = body.currentPassword;
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Укажите текущий пароль" },
          { status: 400 },
        );
      }
      const valid = await verifyAdmin(currentPassword);
      if (!valid) {
        return NextResponse.json(
          { error: "Неверный текущий пароль" },
          { status: 401 },
        );
      }
      if (typeof body.adminPassword !== "string" || body.adminPassword.length < 6) {
        return NextResponse.json(
          { error: "Новый пароль слишком короткий (мин. 6 символов)" },
          { status: 400 },
        );
      }
      await setAdminPassword(body.adminPassword);
      await logActivity("password_change", "Пароль администратора изменён");
      delete body.adminPassword;
      delete body.currentPassword;
    }

    // Сохранение остальных настроек
    for (const [key, value] of Object.entries(body)) {
      if (key === "_test") continue;
      if (SETTINGS_KEYS.includes(key)) {
        await db.setting.upsert({
          where: { key },
          update: { value: String(value || "") },
          create: { key, value: String(value || "") },
        });
      }
    }

    // Тестовые уведомления
    if (body._test === "telegram") {
      const tgOk = await sendTelegramNotification({
        type: "test",
        title: "Тестовое уведомление",
        message: "Настройки Telegram подключены успешно! ✓",
      });
      await logActivity(
        "test_notification",
        "Тестовое уведомление в Telegram: " + (tgOk ? "успешно" : "ошибка"),
      );
      if (!tgOk) {
        return NextResponse.json(
          { error: "Не удалось отправить. Проверьте токен и Chat ID." },
          { status: 400 },
        );
      }
    }

    if (body._test === "max") {
      const mxOk = await sendMaxNotification({
        type: "test",
        title: "Тестовое уведомление",
        message: "Настройки Max webhook подключены успешно!",
      });
      await logActivity(
        "test_notification",
        "Тестовое уведомление в Max: " + (mxOk ? "успешно" : "ошибка"),
      );
      if (!mxOk) {
        return NextResponse.json(
          { error: "Не удалось отправить. Проверьте URL вебхука." },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
