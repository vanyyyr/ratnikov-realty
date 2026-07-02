import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalLeads,
      newLeads,
      totalDeals,
      activeDeals,
      closedDeals,
      totalClients,
      pendingTasks,
      totalRevenue,
      recentActivity,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "new" } }),
      db.deal.count(),
      db.deal.count({
        where: {
          stage: { in: ["new", "showing", "negotiation", "contract"] },
        },
      }),
      db.deal.count({ where: { stage: "closed_won" } }),
      db.client.count(),
      db.task.count({ where: { status: { in: ["pending", "in_progress"] } } }),
      db.deal.aggregate({
        where: { stage: "closed_won" },
        _sum: { value: true },
      }),
      db.activityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const leadsByStatus = await db.lead.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const dealsByStage = await db.deal.groupBy({
      by: ["stage"],
      _count: { stage: true },
    });

    const leadsByMonth = await db.$queryRaw<
      { month: string; count: number }[]
    >`SELECT strftime('%Y-%m', createdAt) as month, COUNT(*) as count FROM Lead GROUP BY month ORDER BY month DESC LIMIT 12`;

    return NextResponse.json({
      totalLeads,
      newLeads,
      totalDeals,
      activeDeals,
      closedDeals,
      totalClients,
      pendingTasks,
      totalRevenue: totalRevenue._sum.value || 0,
      recentActivity,
      leadsByStatus,
      dealsByStage,
      leadsByMonth,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}