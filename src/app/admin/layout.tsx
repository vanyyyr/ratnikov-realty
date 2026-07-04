"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Handshake,
  Building2,
  CheckSquare,
  BarChart3,
  Settings,
  MessageSquare,
  Star,
  BookOpen,
  Trophy,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Лиды", icon: Users },
  { href: "/admin/deals", label: "Сделки", icon: Handshake },
  { href: "/admin/clients", label: "Клиенты", icon: UserCircle },
  { href: "/admin/properties", label: "Объекты", icon: Building2 },
  { href: "/admin/tasks", label: "Задачи", icon: CheckSquare },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/admin/templates", label: "Шаблоны", icon: MessageSquare },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/cases", label: "Кейсы", icon: Trophy },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
  { href: "/admin/guide", label: "Гайд", icon: BookOpen },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Дашборд",
  "/admin/leads": "Лиды",
  "/admin/deals": "Сделки",
  "/admin/clients": "Клиенты",
  "/admin/properties": "Объекты",
  "/admin/tasks": "Задачи",
  "/admin/analytics": "Аналитика",
  "/admin/templates": "Шаблоны",
  "/admin/reviews": "Отзывы",
  "/admin/cases": "Кейсы",
  "/admin/settings": "Настройки",
  "/admin/guide": "Гайд по CRM",
};

const emptySubscribe = () => () => {};

function SidebarNav({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">ВК</span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">Визитка</p>
          <p className="text-gray-500 text-xs truncate">панель управления</p>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-gray-800" />

      <div className="px-3 py-4">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm transition-colors rounded-lg hover:bg-gray-800/50"
        >
          <ExternalLink className="w-4 h-4" />
          На сайт
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 text-sm transition-colors rounded-lg hover:bg-gray-800/50 w-full"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!mounted) return;
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [mounted, pathname, router]);

  const closeSidebar = () => setSidebarOpen(false);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin && pathname !== "/admin/login") {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const currentPage = PAGE_TITLES[pathname] || "CRM";

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0A0A0A] z-30 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-700 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">ВК</span>
          </div>
          <span className="text-white font-semibold text-sm">CRM</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0A0A0A] z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarNav pathname={pathname} onClose={closeSidebar} />
      </aside>

      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-lg font-semibold text-gray-900">{currentPage}</h1>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        На сайт
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Открыть сайт</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-red-700 text-white text-xs font-bold">
                  АД
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}