import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public settings — no auth required
// Returns only safe, public-facing configuration values
const PUBLIC_KEYS = [
  "cian_profile_url",
  "social_telegram",
  "social_vk",
  "social_instagram",
  "social_whatsapp",
  "yandex_metrika_id",
];

export async function GET() {
  const settings = await db.setting.findMany({
    where: { key: { in: PUBLIC_KEYS } },
  });
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return NextResponse.json(map);
}