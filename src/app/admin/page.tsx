"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Handshake,
  UserCircle,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
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
} from "recharts";

const PIE_COLORS = ["#3b82f6", "#eab308", "#22c55e", "#a855f7", "#ef4444", "#6b7280"];

const STAGE_LABELS: Record<string, string> = {
  new: "Новые",
  showing: "Показ",
  negotiation: "Переговоры",
  contract: "Договор",
  closed_won: "Успешно",
  closed_lost: "Провалено",
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

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const pieData = data
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

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(val);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "только что";
    if (mins < 60) return `${mins} мин. назад`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ч. назад`;
    const days = Math.floor(hrs / 24);
    return `${days} дн. назад`;
  };

  const actionIcon = (action: string) => {
    if (action.includes("lead")) return "👤";
    if (action.includes("deal")) return "🤝";
    if (action.includes("client")) return "📋";
    return "📝";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Новые лиды"
          value={data?.newLeads ?? 0}
          icon={Users}
          accent="blue"
          href="/admin/leads"
        />
        <StatCard
          title="Активные сделки"
          value={data?.activeDeals ?? 0}
          icon={Handshake}
          accent="red"
          href="/admin/deals"
        />
        <StatCard
          title="Клиенты"
          value={data?.totalClients ?? 0}
          icon={UserCircle}
          accent="green"
          href="/admin/clients"
        />
        <StatCard
          title="Задачи"
          value={data?.pendingTasks ?? 0}
          icon={CheckSquare}
          accent="yellow"
          href="/admin/tasks"
        />
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-[40px]" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Выручка
              </p>
              <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {data ? formatMoney(data.totalRevenue) : "0 ₽"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {data?.closedDeals ?? 0} закрытых сделок
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/leads">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Новый лид
          </Button>
        </Link>
        <Link href="/admin/deals">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Новая сделка
          </Button>
        </Link>
        <Link href="/admin/tasks">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Новая задача
          </Button>
        </Link>
        <Link href="/admin/clients">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Новый клиент
          </Button>
        </Link>
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Лиды по месяцам
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
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
                  <Bar dataKey="count" fill="#B91C1C" radius={[4, 4, 0, 0]} name="Лиды" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных о лидах
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Сделки по стадиям
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, idx) => (
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
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                Нет данных о сделках
              </div>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">
              Последняя активность
            </CardTitle>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-base mt-0.5">{actionIcon(item.action)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{item.details}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Пока нет активности
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  href,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: "red" | "blue" | "green" | "yellow";
  href: string;
}) {
  const accentColors = {
    red: "bg-red-700",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
  };
  const accentBg = {
    red: "bg-red-50",
    blue: "bg-blue-50",
    green: "bg-green-50",
    yellow: "bg-yellow-50",
  };

  return (
    <Link href={href}>
      <Card className="relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
        <div
          className={`absolute top-0 right-0 w-16 h-16 ${accentBg[accent]} rounded-bl-[32px]`}
        />
        <CardContent className="p-4 pt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            <div
              className={`w-8 h-8 ${accentColors[accent]} rounded-lg flex items-center justify-center`}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 group-hover:text-red-700 transition-colors">
            Открыть <ArrowRight className="w-3 h-3" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}