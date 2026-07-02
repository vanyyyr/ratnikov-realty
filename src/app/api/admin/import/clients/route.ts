import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/notifications";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field.trim());
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && i + 1 < text.length && text[i + 1] === "\n") {
          i++;
        }
        current.push(field.trim());
        if (current.some((c) => c.length > 0)) {
          rows.push(current);
        }
        current = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  current.push(field.trim());
  if (current.some((c) => c.length > 0)) {
    rows.push(current);
  }
  return rows;
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-zа-яё0-9]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length < 2) {
      return NextResponse.json({ error: "CSV is empty or has no data rows" }, { status: 400 });
    }

    const headerRow = rows[0].map(normalizeHeader);
    const nameIdx = headerRow.findIndex((h) => h.includes("name") || h.includes("имя"));
    const phoneIdx = headerRow.findIndex((h) => h.includes("phone") || h.includes("телефон"));
    const emailIdx = headerRow.findIndex((h) => h.includes("email") || h.includes("почта"));
    const telegramIdx = headerRow.findIndex((h) => h.includes("telegram") || h.includes("телеграм"));
    const sourceIdx = headerRow.findIndex((h) => h.includes("source") || h.includes("источник"));
    const notesIdx = headerRow.findIndex((h) => h.includes("notes") || h.includes("заметк"));
    const tagsIdx = headerRow.findIndex((h) => h.includes("tags") || h.includes("тег"));

    let imported = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = nameIdx >= 0 ? row[nameIdx] : "";
      const phone = phoneIdx >= 0 ? row[phoneIdx] : "";
      if (!name && !phone) continue;

      let tagsStr: string | undefined;
      if (tagsIdx >= 0 && row[tagsIdx]) {
        const tagParts = row[tagsIdx].split(",").map((t) => t.trim()).filter(Boolean);
        if (tagParts.length > 0) {
          tagsStr = JSON.stringify(tagParts);
        }
      }

      await db.client.create({
        data: {
          name: name || "Imported Client",
          phone: phone || "N/A",
          email: emailIdx >= 0 ? row[emailIdx] || null : null,
          telegram: telegramIdx >= 0 ? row[telegramIdx] || null : null,
          source: sourceIdx >= 0 ? row[sourceIdx] || null : "import",
          notes: notesIdx >= 0 ? row[notesIdx] || null : null,
          tags: tagsStr,
        },
      });
      imported++;
    }

    await logActivity("clients_imported", `Импортировано клиентов: ${imported}`);

    return NextResponse.json({
      success: true,
      imported,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: String(error) }, { status: 500 });
  }
}