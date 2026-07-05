import type { NextResponse } from "next/server";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const ADMIN_PASSWORD_KEY = "admin_password";
const ADMIN_PASSWORD_SET_KEY = "admin_password_set";

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "change-me-in-env-please-32chars-long!",
);
const SESSION_TTL = "7d";

/**
 * Хеширование пароля (bcrypt). Используется только серверной стороной.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

/**
 * Проверка пароля против хеша или плейн-текста (для обратной совместимости
 * со старыми паролями, сохранёнными до внедрения хеширования).
 */
export async function comparePassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  // bcrypt хеши начинаются с $2
  if (stored.startsWith("$2")) {
    try {
      return await bcrypt.compare(plain, stored);
    } catch {
      return false;
    }
  }
  // legacy plain-text сравнение
  return plain === stored;
}

/**
 * Проверка пароля администратора.
 * Если пароль ещё не задан в БД — возвращает false (требуется первичная установка).
 */
export async function verifyAdmin(password: string): Promise<boolean> {
  const setting = await db.setting.findUnique({
    where: { key: ADMIN_PASSWORD_KEY },
  });
  if (!setting?.value) return false;
  return comparePassword(password, setting.value);
}

/**
 * Установка (с хешированием) нового пароля администратора.
 */
export async function setAdminPassword(newPassword: string) {
  const hashed = await hashPassword(newPassword);
  await db.setting.upsert({
    where: { key: ADMIN_PASSWORD_KEY },
    update: { value: hashed },
    create: { key: ADMIN_PASSWORD_KEY, value: hashed },
  });
  await db.setting.upsert({
    where: { key: ADMIN_PASSWORD_SET_KEY },
    update: { value: "true" },
    create: { key: ADMIN_PASSWORD_SET_KEY, value: "true" },
  });
}

/**
 * Проверка: был ли пароль администратора уже установлен.
 */
export async function isAdminPasswordSet(): Promise<boolean> {
  const flag = await db.setting.findUnique({
    where: { key: ADMIN_PASSWORD_SET_KEY },
  });
  if (flag?.value === "true") return true;
  // Также считаем, что пароль установлен, если есть значение admin_password
  const pw = await db.setting.findUnique({
    where: { key: ADMIN_PASSWORD_KEY },
  });
  return Boolean(pw?.value);
}

/**
 * Создание подписанного JWT и запись его в HTTP-only cookie.
 */
export async function createSession(res: NextResponse): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(SESSION_SECRET);

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });
}

/**
 * Удаление сессионной cookie.
 */
export function clearSession(res: NextResponse): void {
  res.cookies.delete(SESSION_COOKIE);
}

/**
 * Проверка сессии по JWT из запроса (для middleware / API routes).
 */
export async function verifySession(
  req: Request,
): Promise<boolean> {
  let token: string | undefined;
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`),
  );
  token = match?.[1];
  if (!token) return false;
  try {
    await jwtVerify(token, SESSION_SECRET);
    return true;
  } catch {
    return false;
  }
}
