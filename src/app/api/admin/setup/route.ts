import { NextRequest, NextResponse } from "next/server";
import {
  setAdminPassword,
  createSession,
  isAdminPasswordSet,
} from "@/lib/auth";

/**
 * POST /api/admin/setup
 * Первичная установка пароля администратора.
 * Доступен ТОЛЬКО если пароль ещё не задан в БД.
 */
export async function POST(req: NextRequest) {
  try {
    // Если пароль уже установлен — endpoint блокируется.
    const already = await isAdminPasswordSet();
    if (already) {
      return NextResponse.json(
        { error: "Password already set" },
        { status: 403 },
      );
    }

    const { password } = await req.json().catch(() => ({}));
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await setAdminPassword(password);
    const res = NextResponse.json({ success: true });
    await createSession(res);
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
