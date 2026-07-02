import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { sendNotification, logActivity } from "@/lib/notifications";

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  serviceType: z.string().optional(),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        serviceType: parsed.data.serviceType || null,
        comment: parsed.data.comment || null,
        status: "new",
        source: "website",
      },
    });

    await sendNotification({
      type: "new_lead",
      title: "Новая заявка с сайта",
      message: `*Имя:* ${parsed.data.name}\n*Телефон:* ${parsed.data.phone}${
        parsed.data.serviceType ? `\n*Услуга:* ${parsed.data.serviceType}` : ""
      }${parsed.data.comment ? `\n*Комментарий:* ${parsed.data.comment}` : ""}`,
    });

    await logActivity("new_lead", `Новая заявка: ${parsed.data.name}, ${parsed.data.phone}`);

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}