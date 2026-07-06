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
    // Создаём все таблицы через upsert (если не существуют)
    // Это создаст таблицы Setting, Lead, Review, Case минимум
    await db.lead.upsert({
      where: { id: "__init__" },
      update: {},
      create: {
        id: "__init__",
        name: "init",
        phone: "init",
        status: "new",
        source: "init",
      },
    }).catch(() => {});

    await db.review.upsert({
      where: { id: "__init__" },
      update: {},
      create: {
        id: "__init__",
        name: "init",
        text: "init",
        rating: 5,
      },
    }).catch(() => {});

    // Удаляем init записи
    await db.lead.delete({ where: { id: "__init__" } }).catch(() => {});
    await db.review.delete({ where: { id: "__init__" } }).catch(() => {});

    // Создаём пароль
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