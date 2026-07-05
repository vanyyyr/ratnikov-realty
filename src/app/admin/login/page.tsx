"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [passwordSet, setPasswordSet] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => {
        if (!d.passwordSet) {
          setPasswordSet(false);
          setNeedsSetup(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Вход выполнен");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("Неверный пароль");
      }
    } catch {
      toast.error("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Минимум 6 символов");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Пароль установлен");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.error || "Ошибка");
      }
    } catch {
      toast.error("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <a
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          На сайт
        </a>
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-red-700 rounded-xl flex items-center justify-center mb-3">
              {needsSetup ? (
                <KeyRound className="w-6 h-6 text-white" />
              ) : (
                <Lock className="w-6 h-6 text-white" />
              )}
            </div>
            <CardTitle className="text-xl font-bold">
              {needsSetup ? "Первичная настройка" : "Панель управления"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {needsSetup
                ? "Придумайте пароль администратора"
                : "Введите пароль для входа"}
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={needsSetup ? handleSetup : handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800"
                disabled={loading}
              >
                {loading
                  ? needsSetup
                    ? "Сохранение..."
                    : "Вход..."
                  : needsSetup
                    ? "Установить пароль"
                    : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-gray-400 mt-4">
          CRM Риэлтора &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
