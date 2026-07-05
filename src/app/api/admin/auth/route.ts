import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdmin,
  createSession,
  clearSession,
  isAdminPasswordSet,
} from "@/lib/auth";

/**
 * POST /api/admin/auth
 * body: { password: string }      → проверка пароля и установка сессии
 * body: { action: "logout" }      → выход, очистка cookie
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Выход
    if (body?.action === "logout") {
      const res = NextResponse.json({ success: true });
      clearSession(res);
      return res;
    }

    const { password } = body;
    if (typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 400 },
      );
    }

    const valid = await verifyAdmin(password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ success: true });
    await createSession(res);
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * GET /api/admin/auth — статус: установлен ли пароль + есть ли активная сессия.
 */
export async function GET() {
  const passwordSet = await isAdminPasswordSet();
  return NextResponse.json({ passwordSet });
}
