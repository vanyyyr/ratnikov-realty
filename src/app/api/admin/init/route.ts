import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setAdminPassword } from "@/lib/auth";

/**
 * Инициализация базы данных.
 * Создаёт таблицы (если их нет) и устанавливает начальный пароль.
 * В production должно быть удалено/закрыто после первого запуска.
 */
export async function POST(req: NextRequest) {
  const { action, password } = await req.json().catch(() => ({}));

  if (action !== "init") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  try {
    // Сначала создаём таблицу Setting если её нет (raw query)
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Setting" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Устанавливаем пароль
    await setAdminPassword(password);

    return NextResponse.json({
      success: true,
      message: "Database initialized. You can now login.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Initialization failed", details: String(error) },
      { status: 500 },
    );
  }
}