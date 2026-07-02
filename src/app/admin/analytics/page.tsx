"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, Users, Handshake, Target, DollarSign, Activity } from "lucide-react";

const PIE_COLORS = ["#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ef4444", "#6b7280"];
const RED = "#B91C1C";

const STAGE_LABELS: Record<string, string> = {
  new: "Новые",
  showing: "Показ",
  negotiation: "Переговоры",
  contract: "Договор",
  closed_won: "Успешно",
  closed_lost: "Провалено",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новые",
  contacted: "Контактированные",
  qualified: "Квалифицированные",
  lost: "Потерянные",
};

interface DashboardData {
  totalLeads: number;
  newLeads: number;
  totalDeals: number;
  activeDeals: number;
  closedDeals: number;
  totalClients: number;
  pendingTasks: number;
  totalRevenue: number;
  recentActivity: { id: string; action: string; details: string; createdAt: string }[];
  leadsByStatus: { status: string; _count: { status: number } }[];
  dealsByStage: { stage: string; _count: { stage: number } }[];
  leadsByMonth: { month: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(val);

  const leadsByStatusData = data
    ? data.leadsByStatus.map((d) => ({
        name: STATUS_LABELS[d.status] || d.status,
        value: d._count.status,
      }))
    : [];

  const dealsByStageData = data
    ? data.dealsByStage.map((d) => ({
        name: STAGE_LABELS[d.stage] || d.stage,
        value: d._count.stage,
      }))
    : [];

  const barData = data
    ? [...data.leadsByMonth].reverse().map((d) => ({
        month: d.month,
        count: d.count,
      }))
    : [];

  // KPIs
  const conversionRate =
    data && data.totalLeads > 0
      ? ((data.totalClients / data.totalLeads) * 100).toFixed(1)
      : "0";
  const dealCloseRate =
    data && data.totalDeals > 0
      ? ((data.closedDeals / data.totalDeals) * 100).toFixed(1)
      : "0";
  const avgDealValue =
    data && data.closedDeals > 0
      ? data.totalRevenue / data.closedDeals
      : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Конверсия лиды → клиенты</span>
            </div>
            <p className="text-2xl font-bold">{conversionRate}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {data?.totalLeads ?? 0} лидов → {data?.totalClients ?? 0} клиентов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Закрываемость сделок</span>
            </div>
            <p className="text-2xl font-bold">{dealCloseRate}%</p>
            <p className="text-xs text-gray-400 mt-1">
              {data?.closedDeals ?? 0} из {data?.totalDeals ?? 0} сделок
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Средний чек</span>
            </div>
            <p className="text-2xl font-bold">{formatMoney(avgDealValue)}</p>
            <p className="text-xs text-gray-400 mt-1">
              По {data?.closedDeals ?? 0} закрытым сделкам
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Handshake className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Активная воронка</span>
            </div>
            <p className="text-2xl font-bold">{data?.activeDeals ?? 0}</p>
            <p className="text-xs text-gray-400 mt-1">
              сделок в работе
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads by month */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-700" />
              Динамика лидов по месяцам
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    allowDecimals={false}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="count" fill={RED} radius={[4, 4, 0, 0]} name="Лиды" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads by status pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Распределение лидов по статусам
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leadsByStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadsByStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {leadsByStatusData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deals by stage pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-green-600" />
              Воронка сделок
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dealsByStageData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dealsByStageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dealsByStageData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
                  {dealsByStageData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="text-gray-600">
                        {item.name}: <strong>{item.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-600" />
              Сводка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatRow label="Всего лидов" value={String(data?.totalLeads ?? 0)} />
              <StatRow label="Новых лидов" value={String(data?.newLeads ?? 0)} color="blue" />
              <Separator />
              <StatRow label="Всего клиентов" value={String(data?.totalClients ?? 0)} />
              <Separator />
              <StatRow label="Всего сделок" value={String(data?.totalDeals ?? 0)} />
              <StatRow label="Активных сделок" value={String(data?.activeDeals ?? 0)} color="blue" />
              <StatRow label="Закрытых сделок" value={String(data?.closedDeals ?? 0)} color="green" />
              <Separator />
              <StatRow label="Общая выручка" value={formatMoney(data?.totalRevenue ?? 0)} color="red" bold />
              <StatRow label="Средний чек" value={formatMoney(avgDealValue)} color="red" />
              <Separator />
              <StatRow label="Задач в работе" value={String(data?.pendingTasks ?? 0)} color="yellow" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  color = "gray",
  bold = false,
}: {
  label: string;
  value: string;
  color?: "gray" | "blue" | "green" | "red" | "yellow";
  bold?: boolean;
}) {
  const colorMap = {
    gray: "text-gray-900",
    blue: "text-blue-700",
    green: "text-green-700",
    red: "text-red-700",
    yellow: "text-yellow-700",
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-${bold ? "bold" : "medium"} ${colorMap[color]}`}>
        {value}
      </span>
    </div>
  );
}