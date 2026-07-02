"use client";

import { useState, useEffect, useRef } from "react";
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
import { Separator } from "@/components/ui/separator";
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
  AlertTriangle,
  Clock,
  RefreshCw,
  CalendarDays,
  Phone,
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
import { toast } from "sonner";

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

interface Reminder {
  type: string;
  message: string;
  suggestedAction?: string;
  entityId?: string;
}

interface RecentLead {
  id: string;
  name: string;
  phone: string;
  status: string;
  createdAt: string;
}

interface OverdueTask {
  id: string;
  title: string;
  dueDate: string;
  clientName: string | null;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);
  const [activeDeals, setActiveDeals] = useState<{ stage: string; count: number }[]>([]);
  const remindersIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchDashboard();
    fetchReminders();
    fetchWidgets();

    // Auto-refresh reminders every 5 minutes
    remindersIntervalRef.current = setInterval(() => {
      fetchReminders();
    }, 5 * 60 * 1000);

    return () => {
      if (remindersIntervalRef.current) {
        clearInterval(remindersIntervalRef.current);
      }
    };
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

  const fetchReminders = async () => {
    try {
      const res = await fetch("/api/admin/reminders");
      if (res.ok) {
        const json = await res.json();
        setReminders(Array.isArray(json) ? json : json.reminders || []);
      }
    } catch {
      // silent
    } finally {
      setRemindersLoading(false);
    }
  };

  const fetchWidgets = async () => {
    try {
      const [leadsRes, tasksRes, dealsRes] = await Promise.all([
        fetch("/api/admin/leads?status=new"),
        fetch("/api/admin/tasks"),
        fetch("/api/admin/deals"),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        const leadsArr = leadsData.leads || leadsData;
        setRecentLeads(
          leadsArr
            .sort((a: RecentLead, b: RecentLead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      }

      if (tasksRes.ok) {
        const allTasks = await tasksRes.json();
        const now = new Date(new Date().toDateString());
        setOverdueTasks(
          allTasks.filter(
            (t: OverdueTask) => t.dueDate && new Date(t.dueDate) < now
          )
        );
      }

      if (dealsRes.ok) {
        const allDeals = await dealsRes.json();
        const stageCounts: Record<string, number> = {};
        for (const deal of allDeals) {
          if (deal.stage !== "closed_won" && deal.stage !== "closed_lost") {
            stageCounts[deal.stage] = (stageCounts[deal.stage] || 0) + 1;
          }
        }
        setActiveDeals(Object.entries(stageCounts).map(([stage, count]) => ({ stage, count })));
      }
    } catch {
      // silent
    }
  };

  const handleSendReminder = async () => {
    try {
      const res = await fetch("/api/admin/reminders?send=true");
      if (res.ok) {
        toast.success("Напоминания отправлены в Telegram");
        fetchReminders();
      }
    } catch {
      toast.error("Ошибка отправки напоминаний");
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

  const reminderIcon = (type: string) => {
    if (type === "stale_deal") return <RefreshCw className="w-4 h-4 text-amber-500" />;
    if (type === "overdue_task") return <AlertTriangle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-blue-500" />;
  };

  const STATUS_MAP: Record<string, { label: string; color: string }> = {
    new: { label: "Новый", color: "bg-blue-100 text-blue-700" },
    contacted: { label: "Контактированный", color: "bg-yellow-100 text-yellow-700" },
    qualified: { label: "Квалифицированный", color: "bg-green-100 text-green-700" },
    lost: { label: "Потерянный", color: "bg-red-100 text-red-700" },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-xl" />
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
      {/* Reminders Card */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-gray-700">Напоминания</CardTitle>
              {reminders.length > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs h-5">
                  {reminders.length}
                </Badge>
              )}
            </div>
            {reminders.length > 0 && (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSendReminder}>
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Напомнить
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {remindersLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : reminders.length === 0 ? (
            <p className="text-sm text-green-600 font-medium">✓ Нет активных напоминаний</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reminders.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm bg-white rounded-lg p-2.5 border border-amber-100">
                  <div className="mt-0.5">{reminderIcon(r.type)}</div>
                  <p className="text-gray-700 text-xs leading-relaxed">{r.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <Card className="relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-[40px]" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Выручка</p>
              <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {data ? formatMoney(data.totalRevenue) : "0 ₽"}
            </p>
            <p className="text-xs text-gray-400 mt-1">{data?.closedDeals ?? 0} закрытых сделок</p>
          </CardContent>
        </Card>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Последние лиды
              </CardTitle>
              <Link href="/admin/leads">
                <ArrowRight className="w-4 h-4 text-gray-400 hover:text-red-700 transition-colors" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Нет лидов</p>
            ) : (
              recentLeads.map((lead) => {
                const si = STATUS_MAP[lead.status] || STATUS_MAP.new;
                return (
                  <div key={lead.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{lead.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                        <span className="ml-1">{timeAgo(lead.createdAt)}</span>
                      </p>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] flex-shrink-0 ml-2 ${si.color}`}>
                      {si.label}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Просроченные задачи
              </CardTitle>
              <Link href="/admin/tasks">
                <ArrowRight className="w-4 h-4 text-gray-400 hover:text-red-700 transition-colors" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueTasks.length === 0 ? (
              <p className="text-xs text-green-600 text-center py-4">✓ Нет просроченных</p>
            ) : (
              overdueTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-red-700 font-medium truncate">{task.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })}
                      {task.clientName && <span> · {task.clientName}</span>}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Deals Pipeline */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-green-500" />
                Сделки в работе
              </CardTitle>
              <Link href="/admin/deals">
                <ArrowRight className="w-4 h-4 text-gray-400 hover:text-red-700 transition-colors" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeDeals.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Нет активных сделок</p>
            ) : (
              activeDeals.map((d) => (
                <div key={d.stage} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{STAGE_LABELS[d.stage] || d.stage}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {d.count}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Быстрые действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/leads" className="block">
              <Button variant="outline" className="w-full justify-start text-sm h-11">
                <Plus className="w-4 h-4 mr-2" />Новый лид
              </Button>
            </Link>
            <Link href="/admin/tasks" className="block">
              <Button variant="outline" className="w-full justify-start text-sm h-11">
                <Plus className="w-4 h-4 mr-2" />Новая задача
              </Button>
            </Link>
            <Link href="/admin/clients" className="block">
              <Button variant="outline" className="w-full justify-start text-sm h-11">
                <Plus className="w-4 h-4 mr-2" />Новый клиент
              </Button>
            </Link>
            <Link href="/admin/deals" className="block">
              <Button variant="outline" className="w-full justify-start text-sm h-11">
                <Plus className="w-4 h-4 mr-2" />Новая сделка
              </Button>
            </Link>
          </CardContent>
        </Card>
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
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-base mt-0.5">{actionIcon(item.action)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{item.details}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Пока нет активности</p>
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
        <div className={`absolute top-0 right-0 w-16 h-16 ${accentBg[accent]} rounded-bl-[32px]`} />
        <CardContent className="p-4 pt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <div className={`w-8 h-8 ${accentColors[accent]} rounded-lg flex items-center justify-center`}>
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