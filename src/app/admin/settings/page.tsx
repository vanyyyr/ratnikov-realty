"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  MessageCircle,
  Send,
  Globe,
  BarChart3,
  Lock,
  Building2,
  Save,
  CheckCircle,
  Star,
  Phone,
  Trophy,
  TrendingUp,
  Percent,
} from "lucide-react";

type Settings = Record<string, string>;

interface SettingsSection {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: { key: string; label: string; placeholder: string; type?: string }[];
}

const SECTIONS: SettingsSection[] = [
  {
    key: "telegram",
    title: "Уведомления Telegram",
    description: "Настройка бота для получения уведомлений о новых заявках",
    icon: MessageCircle,
    fields: [
      { key: "telegram_bot_token", label: "Bot Token", placeholder: "123456:ABC-DEF..." },
      { key: "telegram_chat_id", label: "Chat ID", placeholder: "-100123456789" },
    ],
  },
  {
    key: "max",
    title: "Уведомления Max",
    description: "Настройка вебхука для интеграции с Max",
    icon: Send,
    fields: [
      { key: "max_webhook_url", label: "Webhook URL", placeholder: "https://..." },
    ],
  },
  {
    key: "social",
    title: "Социальные сети",
    description: "Ссылки на социальные сети для отображения на сайте",
    icon: Globe,
    fields: [
      { key: "social_telegram", label: "Telegram", placeholder: "https://t.me/username" },
      { key: "social_vk", label: "ВКонтакте", placeholder: "https://vk.com/username" },
      { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
      { key: "social_whatsapp", label: "WhatsApp", placeholder: "https://wa.me/79001234567" },
    ],
  },
  {
    key: "metrika",
    title: "Яндекс.Метрика",
    description: "Подключение счётчика Яндекс.Метрики для аналитики",
    icon: BarChart3,
    fields: [
      { key: "yandex_metrika_id", label: "ID счётчика", placeholder: "12345678" },
    ],
  },
  {
    key: "cian",
    title: "Профиль ЦИАН",
    description: "Ссылка на ваш профиль на ЦИАН",
    icon: Building2,
    fields: [
      { key: "cian_profile_url", label: "URL профиля", placeholder: "https://cian.ru/user/..." },
    ],
  },
  {
    key: "contact",
    title: "Контакты",
    description: "Телефон и адрес офиса для отображения на сайте",
    icon: Phone,
    fields: [
      { key: "phone", label: "Телефон", placeholder: "+79892467798" },
      { key: "address", label: "Адрес офиса", placeholder: "ул. Комсомола, 41" },
    ],
  },
  {
    key: "max_profile",
    title: "Профиль Max",
    description: "Ссылка на ваш профиль в Max",
    icon: MessageCircle,
    fields: [
      { key: "max_profile_url", label: "Профиль Max", placeholder: "https://max.ru/..." },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setSettings(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (sectionKey: string) => {
    setSaving(sectionKey);
    try {
      const section = SECTIONS.find((s) => s.key === sectionKey);
      if (!section) return;

      const body: Record<string, string> = {};
      for (const field of section.fields) {
        body[field.key] = settings[field.key] || "";
      }

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("Настройки сохранены");
      }
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSaving(null);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error("Заполните все поля пароля");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("Пароли не совпадают");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error("Пароль должен быть не менее 6 символов");
      return;
    }

    setSaving("password");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.current,
          adminPassword: passwordForm.newPass,
        }),
      });
      if (res.ok) {
        toast.success("Пароль изменён");
        setPasswordForm({ current: "", newPass: "", confirm: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Ошибка смены пароля");
      }
    } catch {
      toast.error("Ошибка смены пароля");
    } finally {
      setSaving(null);
    }
  };

  const testTelegram = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_bot_token: settings.telegram_bot_token || "",
          telegram_chat_id: settings.telegram_chat_id || "",
          _test: "telegram",
        }),
      });
      if (res.ok) {
        toast.success("Тестовое уведомление отправлено");
      }
    } catch {
      toast.error("Ошибка отправки тестового уведомления");
    }
  };

  const testMax = async () => {
    toast.info("Тестирование вебхука Max...");
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Settings sections */}
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isSaving = saving === section.key;
        return (
          <Card key={section.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-red-700" />
                </div>
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-sm">{field.label}</Label>
                  <Input
                    type={field.type || "text"}
                    value={settings[field.key] || ""}
                    onChange={(e) => updateSetting(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  className="bg-red-700 hover:bg-red-800"
                  onClick={() => saveSection(section.key)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Сохранить
                </Button>

                {section.key === "telegram" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={testTelegram}
                    disabled={isSaving}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Тест уведомления
                  </Button>
                )}

                {section.key === "max" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={testMax}
                    disabled={isSaving}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Тест
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Cases toggle section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-red-700" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Раздел «Кейсы»</CardTitle>
              <CardDescription className="text-xs">
                Показывать или скрывать блок кейсов на сайте
              </CardDescription>
            </div>
            <Switch
              checked={settings.show_cases !== "false"}
              onCheckedChange={async (checked) => {
                updateSetting("show_cases", checked ? "true" : "false");
                try {
                  await fetch("/api/admin/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ show_cases: checked ? "true" : "false" }),
                  });
                  toast.success(checked ? "Кейсы показываются" : "Кейсы скрыты");
                } catch {
                  toast.error("Ошибка сохранения");
                }
              }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Stats toggle section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-red-700" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Раздел статистики</CardTitle>
              <CardDescription className="text-xs">
                Показывать или скрывать блок статистики на сайте
              </CardDescription>
            </div>
            <Switch
              checked={settings.show_stats !== "false"}
              onCheckedChange={async (checked) => {
                updateSetting("show_stats", checked ? "true" : "false");
                try {
                  await fetch("/api/admin/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ show_stats: checked ? "true" : "false" }),
                  });
                  toast.success(checked ? "Статистика показывается" : "Статистика скрыта");
                } catch {
                  toast.error("Ошибка сохранения");
                }
              }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Commission section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Percent className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <CardTitle className="text-base">Комиссия</CardTitle>
              <CardDescription className="text-xs">
                Размер комиссии для отображения на сайте
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-sm">Размер комиссии (%)</Label>
              <Input
                type="number"
                value={settings.commission_rate || "3"}
                onChange={(e) => updateSetting("commission_rate", e.target.value)}
                placeholder="3"
                min={0}
                max={100}
              />
            </div>
            <Button
              size="sm"
              className="bg-red-700 hover:bg-red-800"
              onClick={async () => {
                try {
                  await fetch("/api/admin/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ commission_rate: settings.commission_rate || "3" }),
                  });
                  toast.success("Комиссия сохранена");
                } catch {
                  toast.error("Ошибка сохранения");
                }
              }}
            >
              <Save className="w-4 h-4 mr-1" />
              Сохранить
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews toggle section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-red-700" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Раздел отзывов</CardTitle>
              <CardDescription className="text-xs">
                Показывать или скрывать блок отзывов на сайте
              </CardDescription>
            </div>
            <Switch
              checked={settings.show_reviews !== "false"}
              onCheckedChange={async (checked) => {
                updateSetting("show_reviews", checked ? "true" : "false");
                try {
                  await fetch("/api/admin/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ show_reviews: checked ? "true" : "false" }),
                  });
                  toast.success(checked ? "Отзывы показываются" : "Отзывы скрыты");
                } catch {
                  toast.error("Ошибка сохранения");
                }
              }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Security section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <CardTitle className="text-base">Безопасность</CardTitle>
              <CardDescription className="text-xs">
                Изменение пароля администратора
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Текущий пароль</Label>
            <Input
              type="password"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Новый пароль</Label>
            <Input
              type="password"
              value={passwordForm.newPass}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPass: e.target.value })
              }
              placeholder="Минимум 4 символа"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Подтвердите пароль</Label>
            <Input
              type="password"
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
              placeholder="Повторите новый пароль"
            />
          </div>
          <Button
            size="sm"
            className="bg-red-700 hover:bg-red-800"
            onClick={handlePasswordChange}
            disabled={saving === "password"}
          >
            {saving === "password" ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-1" />
            )}
            Изменить пароль
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}