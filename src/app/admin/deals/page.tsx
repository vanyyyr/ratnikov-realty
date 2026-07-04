"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Handshake, DollarSign, Calendar, Trash2, Edit, Percent } from "lucide-react";

const STAGES = [
  { key: "new", label: "Новая", color: "bg-gray-100 text-gray-700 border-gray-200" },
  { key: "showing", label: "Показ", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "negotiation", label: "Переговоры", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { key: "contract", label: "Договор", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "closed_won", label: "Успешно", color: "bg-green-50 text-green-700 border-green-200" },
  { key: "closed_lost", label: "Провалено", color: "bg-red-50 text-red-700 border-red-200" },
];

const STAGE_HEADER_COLORS: Record<string, string> = {
  new: "bg-gray-500",
  showing: "bg-blue-500",
  negotiation: "bg-yellow-500",
  contract: "bg-purple-500",
  closed_won: "bg-green-500",
  closed_lost: "bg-red-500",
};

interface Deal {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  commission: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  client: { id: string; name: string } | null;
  property: { id: string; title: string } | null;
}

interface Client {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState({
    title: "",
    clientId: "",
    value: "",
    stage: "new",
    notes: "",
    propertyId: "",
  });

  const fetchDeals = useCallback(async () => {
    try {
      const [dealsRes, clientsRes, propsRes] = await Promise.all([
        fetch("/api/admin/deals"),
        fetch("/api/admin/clients"),
        fetch("/api/admin/properties"),
      ]);
      if (dealsRes.ok) setDeals(await dealsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (propsRes.ok) setProperties(await propsRes.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const resetForm = () => {
    setForm({ title: "", clientId: "", value: "", stage: "new", notes: "", propertyId: "" });
    setEditingDeal(null);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setForm({
      title: deal.title,
      clientId: deal.client?.id || "",
      value: deal.value ? String(deal.value) : "",
      stage: deal.stage,
      notes: deal.notes || "",
      propertyId: deal.property?.id || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Введите название сделки");
      return;
    }
    try {
      const body = {
        title: form.title,
        clientId: form.clientId || null,
        value: form.value ? parseFloat(form.value) : null,
        stage: form.stage,
        notes: form.notes || null,
        propertyId: form.propertyId || null,
      };

      if (editingDeal) {
        const res = await fetch("/api/admin/deals", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingDeal.id, ...body }),
        });
        if (res.ok) {
          toast.success("Сделка обновлена");
        }
      } else {
        if (!body.clientId) {
          toast.error("Выберите клиента");
          return;
        }
        const res = await fetch("/api/admin/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          toast.success("Сделка создана");
        }
      }
      setDialogOpen(false);
      resetForm();
      fetchDeals();
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      const res = await fetch("/api/admin/deals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dealId, stage: newStage }),
      });
      if (res.ok) {
        toast.success("Стадия обновлена");
        fetchDeals();
      }
    } catch {
      toast.error("Ошибка обновления");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/deals?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Сделка удалена");
        fetchDeals();
      }
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(val);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[500px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Всего сделок: {deals.length}
        </p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-red-700 hover:bg-red-800" onClick={openNew} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Новая сделка
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDeal ? "Редактировать сделку" : "Новая сделка"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Например: Покупка 3-комнатной"
                />
              </div>
              <div className="space-y-2">
                <Label>Клиент</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setForm({ ...form, clientId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Объект недвижимости</Label>
                <Select
                  value={form.propertyId}
                  onValueChange={(v) => setForm({ ...form, propertyId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите объект (необязательно)" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Сумма (₽)</Label>
                  <Input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Стадия</Label>
                  <Select
                    value={form.stage}
                    onValueChange={(v) => setForm({ ...form, stage: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Заметки</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Комментарий к сделке..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Отмена</Button>
              <Button className="bg-red-700 hover:bg-red-800" onClick={handleSave}>
                {editingDeal ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board - horizontally scrollable on mobile */}
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 min-w-[640px]">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            return (
              <div key={stage.key} className="flex flex-col">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className={`w-2 h-2 rounded-full ${STAGE_HEADER_COLORS[stage.key]}`} />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {stage.label}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                    {stageDeals.length}
                  </Badge>
                </div>

                {/* Column body */}
                <div className="bg-gray-100/70 rounded-xl p-2 flex-1 min-h-[200px] space-y-2">
                  {stageDeals.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-xs text-gray-400">
                      Пусто
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <Card
                        key={deal.id}
                        className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openEdit(deal)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-sm font-medium leading-tight line-clamp-2">
                              {deal.title}
                            </h4>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <button
                                onClick={(e) => { e.stopPropagation(); openEdit(deal); }}
                                className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 min-w-[28px] min-h-[28px] flex items-center justify-center"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 min-w-[28px] min-h-[28px] flex items-center justify-center"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Удалить сделку?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Сделка &quot;{deal.title}&quot; будет удалена навсегда.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(deal.id)}
                                      className="bg-red-700 hover:bg-red-800"
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          {deal.client && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Handshake className="w-3 h-3" />
                              {deal.client.name}
                            </p>
                          )}

                          {deal.value != null && deal.value > 0 && (
                            <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {formatMoney(deal.value)}
                            </p>
                          )}

                          {deal.commission != null && deal.commission > 0 && (
                            <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              Комиссия: {formatMoney(deal.commission)}
                            </p>
                          )}

                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(deal.createdAt)}
                          </p>

                          {/* Quick stage move */}
                          <div className="pt-1 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={deal.stage}
                              onValueChange={(v) => handleStageChange(deal.id, v)}
                            >
                              <SelectTrigger className="h-7 text-xs border-0 bg-transparent p-0 focus:ring-0 w-full min-h-[28px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STAGES.map((s) => (
                                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}