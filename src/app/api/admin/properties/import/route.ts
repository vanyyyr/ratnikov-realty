import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`http://localhost:3080/parse?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "Unknown error");
      return NextResponse.json({ error: `Parser service error: ${text}` }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Parser service unavailable";
    if (message.includes("timeout")) {
      return NextResponse.json({ error: "Таймаут при загрузке страницы" }, { status: 504 });
    }
    return NextResponse.json({ error: `Сервис парсинга недоступен: ${message}` }, { status: 502 });
  }
}