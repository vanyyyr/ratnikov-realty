import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

// Маршруты, защищённые серверной авторизацией.
const ADMIN_PREFIX = "/admin";
const ADMIN_API_PREFIX = "/api/admin";
// Логин, auth-эндпоинт и первичная установка пароля — публичные.
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/api/admin/auth",
  "/api/admin/setup",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/");
  const isAdminApi = pathname.startsWith(ADMIN_API_PREFIX);

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Публичные пути (логин / auth-эндпоинт) пропускаем.
  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const ok = await verifySession(req);
  if (!ok) {
    // Для API — 401 JSON. Для страниц — редирект на логин.
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Запускаем middleware только для admin-маршрутов — это снижает накладные расходы.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
