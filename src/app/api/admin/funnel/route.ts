import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "Новые",
  contacted: "Связались",
  qualified: "Квалифицированы",
  lost: "Потеряны",
};

const DEAL_STAGE_LABELS: Record<string, string> = {
  new: "Новые",
  showing: "Показы",
  negotiation: "Переговоры",
  contract: "Договор",
  closed_won: "Завершены",
  closed_lost: "Провалены",
};

export async function GET() {
  try {
    const leadsByStatus = await db.lead.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const dealsByStage = await db.deal.groupBy({
      by: ["stage"],
      _count: { stage: true },
    });

    const leads = leadsByStatus.map((l) => ({
      status: l.status,
      count: l._count.status,
      label: LEAD_STATUS_LABELS[l.status] || l.status,
    }));

    const deals = dealsByStage.map((d) => ({
      stage: d.stage,
      count: d._count.stage,
      label: DEAL_STAGE_LABELS[d.stage] || d.stage,
    }));

    // Calculate conversions
    const counts: Record<string, number> = {};
    for (const l of leadsByStatus) {
      counts[l.status] = l._count.status;
    }

    const totalNew = counts["new"] || 0;
    const totalContacted = counts["contacted"] || 0;
    const totalQualified = counts["qualified"] || 0;

    const conversions: Record<string, number> = {};
    if (totalNew > 0) {
      conversions.new_to_contacted = Math.round((totalContacted / totalNew) * 1000) / 10;
    }
    if (totalContacted > 0) {
      conversions.contacted_to_qualified = Math.round((totalQualified / totalContacted) * 1000) / 10;
    }
    if (totalQualified > 0) {
      const dealCount = dealsByStage.reduce((sum, d) => {
        if (!["closed_lost"].includes(d.stage)) return sum + d._count.stage;
        return sum;
      }, 0);
      conversions.qualified_to_deal = Math.round((dealCount / totalQualified) * 1000) / 10;
    }

    return NextResponse.json({ leads, deals, conversions });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}