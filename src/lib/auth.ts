import { db } from "./db";

const ADMIN_PASSWORD_KEY = "admin_password";
const DEFAULT_PASSWORD = "realtor2025";

export async function verifyAdmin(password: string): Promise<boolean> {
  const setting = await db.setting.findUnique({
    where: { key: ADMIN_PASSWORD_KEY },
  });
  const stored = setting?.value || DEFAULT_PASSWORD;
  return password === stored;
}

export async function setAdminPassword(newPassword: string) {
  await db.setting.upsert({
    where: { key: ADMIN_PASSWORD_KEY },
    update: { value: newPassword },
    create: { key: ADMIN_PASSWORD_KEY, value: newPassword },
  });
}