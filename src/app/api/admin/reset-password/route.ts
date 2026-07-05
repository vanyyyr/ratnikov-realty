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

  // Удаляем текущий пароль — после этого система попросит установить новый
  await db.setting.deleteMany({
    where: { key: { in: ["admin_password", "admin_password_set"] } },
  });

  return NextResponse.json({ success: true, message: "Password reset. Go to /admin/login to set new password." });
}