import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setAdminPassword } from "@/lib/auth";

/**
 * Инициализация базы данных.
 * Создаёт таблицы (если их нет) и устанавливает начальный пароль.
 * В production должно быть удалено/закрыто после первого запуска.
 */
export async function POST(req: NextRequest) {
  try {
    // Попробовать выполнить raw query - если таблица существует, база инициализирована
    await db.$queryRaw`SELECT 1 FROM "Setting" LIMIT 1`.catch(async () => {
      // Таблица не существует - возможно база ещё не готова
      // Пытаемся создать минимальную запись
      return await db.setting.create({
        data: { key: "init_marker", value: "pending" },
      });
    });

    // Устанавливаем начальный пароль
    await setAdminPassword("admin123");

    return NextResponse.json({
      success: true,
      message: "Database initialized. Login with password: admin123",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Initialization failed. Run 'npx prisma db push' in Console.",
        details: String(error),
      },
      { status: 500 },
    );
  }
}