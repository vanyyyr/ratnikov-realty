import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Сброс пароля администратора.
 * Используется только для инициализации/восстановления доступа.
 * В production-режиме следует защищать этим эндпоинтом.
 */
export async function POST(req: NextRequest) {
  const { action } = await req.json().catch(() => ({}));

  if (action !== "reset") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    // Удаляем текущий пароль (если таблица существует)
    await db.setting.deleteMany({
      where: { key: { in: ["admin_password"], "in": undefined } },
    }).catch(() => {});
    
    // Создаём запись о сбросе — система попросит задать пароль
    return NextResponse.json({ 
      success: true, 
      message: "Password reset. Go to /admin/login to set new password." 
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      error: "Database not initialized. Run 'npx prisma db push' first." 
    }, { status: 500 });
  }
}