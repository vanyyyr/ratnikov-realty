import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { sendNotification, logActivity } from "@/lib/notifications";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  serviceType: z.string().optional(),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 заявок / минута с одного IP.
    const ip = getClientIp(req);
    const rl = rateLimit(`leads:${ip}`, 5, 60_000);
    if (!rl.ok) {
      const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.max(retryAfter, 1)) },
        },
      );
    }

    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check for duplicate lead with same phone
    const existingLead = await db.lead.findFirst({
      where: { phone: parsed.data.phone },
      orderBy: { createdAt: "desc" },
    });

    const isDuplicate = !!existingLead;

    const lead = await db.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        serviceType: parsed.data.serviceType || null,
        comment: parsed.data.comment || null,
        status: "new",
        source: "website",
        notes: isDuplicate
          ? `Возможный дубликат лида: ${existingLead!.id} (${existingLead!.name}, ${existingLead!.createdAt.toISOString()})`
          : null,
      },
    });

    if (isDuplicate) {
      await logActivity(
        "new_lead_duplicate",
        `Новый лид (возможный дубликат): ${parsed.data.name}, ${parsed.data.phone}. Дублирует: ${existingLead!.id}`
      );
    } else {
      await logActivity("new_lead", `Новая заявка: ${parsed.data.name}, ${parsed.data.phone}`);
    }

    await sendNotification({
      type: "new_lead",
      title: isDuplicate ? "Новая заявка (возможный дубликат)" : "Новая заявка с сайта",
      message: `*Имя:* ${parsed.data.name}\n*Телефон:* ${parsed.data.phone}${
        parsed.data.serviceType ? `\n*Услуга:* ${parsed.data.serviceType}` : ""
      }${parsed.data.comment ? `\n*Комментарий:* ${parsed.data.comment}` : ""}${
        isDuplicate ? `\n\n⚠️ Дубликат лида: ${existingLead!.name} (${existingLead!.createdAt.toLocaleDateString("ru-RU")})` : ""
      }`,
    });

    return NextResponse.json({
      success: true,
      id: lead.id,
      duplicate: isDuplicate,
      ...(isDuplicate && {
        existingLead: {
          id: existingLead!.id,
          name: existingLead!.name,
          phone: existingLead!.phone,
          status: existingLead!.status,
          createdAt: existingLead!.createdAt,
        },
      }),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}