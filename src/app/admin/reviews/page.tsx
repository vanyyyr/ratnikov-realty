"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Star,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  MessageSquare,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  source: string | null;
  isHidden: boolean;
  sortOrder: number;
  createdAt: string;
}

const SOURCE_LABELS: Record<string, string> = {
  manual: "Вручную",
  cian: "ЦИАН",
  google: "Google",
  yandex: "Яндекс",
  avito: "Авито",
};

const SOURCE_COLORS: Record<string, string> = {
  manual: "bg-gray-100 text-gray-700",
  cian: "bg-blue-50 text-blue-700",
  google: "bg-green-50 text-green-700",
  yandex: "bg-yellow-50 text-yellow-700",
  avito: "bg-purple-50 text-purple-700",
};

const emptyReview: Omit<Review, "id" | "createdAt"> = {
  name: "",
  text: "",
  rating: 5,
  source: "manual",
  isHidden: false,
  sortOrder: 0,
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReview);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) setReviews(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyReview, sortOrder: reviews.length });
    setDialogOpen(true);
  };

  const openEdit = (r: Review) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      text: r.text,
      rating: r.rating,
      source: r.source || "manual",
      isHidden: r.isHidden,
      sortOrder: r.sortOrder,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Имя и текст обязательны");
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/reviews/${editingId}`
        : "/api/admin/reviews";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingId ? "Отзыв обновлён" : "Отзыв добавлен");
        setDialogOpen(false);
        fetchReviews();
      }
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/reviews/${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Отзыв удалён");
        setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      }
    } catch {
      toast.error("Ошибка удаления");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleVisibility = async (r: Review) => {
    const newVal = !r.isHidden;
    setReviews((prev) =>
      prev.map((rev) => (rev.id === r.id ? { ...rev, isHidden: newVal } : rev))
    );
    try {
      await fetch(`/api/admin/reviews/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...r,
          isHidden: newVal,
        }),
      });
      toast.success(newVal ? "Отзыв скрыт" : "Отзыв показывается");
    } catch {
      toast.error("Ошибка");
      fetchReviews();
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={interactive ? 20 : 14}
            className={
              interactive
                ? i <= form.rating
                  ? "text-amber-400 fill-amber-400 cursor-pointer"
                  : "text-gray-200 fill-gray-200 cursor-pointer"
                : i <= rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200 fill-gray-200"
            }
            onClick={
              interactive
                ? () => setForm((f) => ({ ...f, rating: i }))
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {reviews.length} отзывов
            {reviews.filter((r) => r.isHidden).length > 0 && (
              <span className="ml-2">
                ({reviews.filter((r) => r.isHidden).length} скрыто)
              </span>
            )}
          </p>
        </div>
        <Button
          className="bg-red-700 hover:bg-red-800"
          onClick={openCreate}
        >
          <Plus className="w-4 h-4 mr-1" />
          Добавить отзыв
        </Button>
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-muted-foreground text-sm">
              Пока нет отзывов. Добавьте первый отзыв.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card
              key={r.id}
              className={`transition-opacity ${r.isHidden ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Left: avatar + info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-foreground">
                        {r.name}
                      </span>
                      {renderStars(r.rating)}
                      {r.source && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 ${SOURCE_COLORS[r.source] || SOURCE_COLORS.manual}`}
                        >
                          {SOURCE_LABELS[r.source] || r.source}
                        </Badge>
                      )}
                      {r.isHidden && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          <EyeOff className="w-3 h-3 mr-0.5" />
                          Скрыт
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {r.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(r.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={r.isHidden ? "Показать" : "Скрыть"}
                      onClick={() => toggleVisibility(r)}
                    >
                      {r.isHidden ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(r)}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-red-600"
                      onClick={() => setDeleteId(r.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Редактировать отзыв" : "Новый отзыв"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Измените данные отзыва"
                : "Заполните данные нового отзыва для отображения на сайте"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Имя</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Имя клиента"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Источник</Label>
                <Select
                  value={form.source || "manual"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, source: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Оценка</Label>
              <div className="flex items-center gap-3">
                {renderStars(form.rating, true)}
                <span className="text-sm text-muted-foreground">
                  {form.rating} из 5
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Текст отзыва</Label>
              <Textarea
                value={form.text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, text: e.target.value }))
                }
                placeholder="Отзыв клиента..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Порядок сортировки</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: Number(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Switch
                  id="hidden-toggle"
                  checked={form.isHidden}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isHidden: v }))
                  }
                />
                <Label htmlFor="hidden-toggle" className="text-sm">
                  Скрыть с сайта
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : editingId ? (
                "Сохранить"
              ) : (
                "Добавить"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить отзыв?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Отзыв будет удалён навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-700 hover:bg-red-800"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}