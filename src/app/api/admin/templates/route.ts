import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEFAULT_TEMPLATES = [
  {
    name: "Приветствие",
    content:
      "Здравствуйте, {name}! Спасибо за обращение. Я — Илья Ратников, риэлтор в Санкт-Петербурге. Свяжусь с вами в ближайшее время.",
    category: "greeting",
  },
  {
    name: "Назначение показа",
    content: "Здравствуйте, {name}! Хотел бы назначить показ объекта. Когда вам будет удобно?",
    category: "showing",
  },
  {
    name: "Follow-up",
    content: "Здравствуйте, {name}! Хотел узнать, удалось ли вам определиться с выбором? Готов помочь.",
    category: "followup",
  },
  {
    name: "Поздравление со сделкой",
    content: "Поздравляю, {name}! Сделка успешно завершена. Буду рад помочь в будущем.",
    category: "congrats",
  },
];

export async function GET(req: NextRequest) {
  try {
    const category = new URL(req.url).searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    let templates = await db.messageTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // If DB is empty, return defaults
    if (templates.length === 0 && !category) {
      return NextResponse.json({
        templates: DEFAULT_TEMPLATES.map((t, i) => ({
          id: `default-${i}`,
          ...t,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _isDefault: true,
        })),
      });
    }

    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, content, category } = await req.json();
    if (!name || !content) {
      return NextResponse.json({ error: "Name and content required" }, { status: 400 });
    }

    const template = await db.messageTemplate.create({
      data: {
        name,
        content,
        category: category || "general",
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}