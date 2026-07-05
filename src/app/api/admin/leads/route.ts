import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const tagsParam = searchParams.get("tags");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    if (tagsParam) {
      const tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
      if (tags.length > 0) {
        // SQLite doesn't support JSON array contains, so we match tags as substrings
        // Each tag in the JSON array is wrapped in quotes
        const tagConditions = tags.map((tag) => ({
          tags: { contains: `"${tag}"` },
        }));
        if (tagConditions.length === 1) {
          where.tags = tagConditions[0].tags;
        } else {
          const existingOr = where.OR as Array<Record<string, unknown>> | undefined;
          where.OR = [...(existingOr || []), ...tagConditions];
        }
      }
    }

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, notes, tags } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (tags !== undefined) {
      updateData.tags = typeof tags === "string" ? tags : JSON.stringify(tags);
    }

    const before = await db.lead.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const lead = await db.lead.update({
      where: { id },
      data: updateData,
    });

    // Activity logging для изменений лида
    if (status && status !== before.status) {
      await logActivity(
        "lead_status_changed",
        `Лид '${before.name}' (${before.phone}): статус '${before.status}' → '${status}'`,
      );
    }
    if (notes !== undefined && notes !== before.notes) {
      await logActivity("lead_notes_updated", `Обновлены заметки по лиду '${before.name}'`);
    }
    if (tags !== undefined) {
      await logActivity("lead_tags_updated", `Обновлены теги лида '${before.name}'`);
    }

    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const before = await db.lead.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await db.lead.delete({ where: { id } });
    await logActivity("lead_deleted", `Удалён лид '${before.name}' (${before.phone})`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
