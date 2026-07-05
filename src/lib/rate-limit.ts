/**
 * Простая in-memory rate limiter на основе скользящего окна.
 * Подходит для single-server deployment (этот проект — SQLite + Bun на одном сервере).
 * Для multi-instance нужен Redis или внешнее хранилище.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Периодически чистим устаревшие записи, чтобы Map не разрастался.
let lastCleanup = Date.now();
function cleanupIfNeeded(now: number) {
  if (now - lastCleanup > 60_000) {
    for (const [key, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(key);
    }
    lastCleanup = now;
  }
}

/**
 * Возвращает true, если запрос разрешён; false — если лимит превышен.
 *
 * @param key     идентификатор клиента (обычно IP)
 * @param limit   максимальное количество запросов в окне
 * @param windowMs размер окна в миллисекундах
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  cleanupIfNeeded(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/**
 * Извлечение IP-адреса клиента из запроса с учётом прокси (Caddy).
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}
