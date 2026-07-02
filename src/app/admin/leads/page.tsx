"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Search,
  ChevronDown,
  ChevronRight,
  Trash2,
  Phone,
  UserCircle,
  Save,
  X,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  serviceType: string | null;
  comment: string | null;
  status: string;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Контактированный", color: "bg-yellow-100 text-yellow-700" },
  qualified: { label: "Квалифицированный", color: "bg-green-100 text-green-700" },
  lost: { label: "Потерянный", color: "bg-red-100 text-red-700" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    setLoading(true);
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        toast.success("Статус обновлён");
        fetchLeads();
      }
    } catch {
      toast.error("Ошибка обновления");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Лид удалён");
        fetchLeads();
      }
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: editNotes[id] || "" }),
      });
      if (res.ok) {
        toast.success("Заметки сохранены");
        fetchLeads();
      }
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSavingNotes(null);
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const lead = leads.find((l) => l.id === id);
      if (lead) {
        setEditNotes((prev) => ({ ...prev, [id]: lead.notes || "" }));
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getServiceLabel = (type: string | null) => {
    const map: Record<string, string> = {
      buy: "Покупка",
      sell: "Продажа",
      consultation: "Консультация",
      newbuild: "Новостройки",
    };
    return type ? map[type] || type : "—";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="new">Новые</TabsTrigger>
            <TabsTrigger value="contacted">Контактированные</TabsTrigger>
            <TabsTrigger value="qualified">Квалифицированные</TabsTrigger>
            <TabsTrigger value="lost">Потерянные</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск по имени или телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Лиды не найдены</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const isExpanded = expandedId === lead.id;
                const statusInfo = STATUS_MAP[lead.status] || STATUS_MAP.new;
                return (
                  <>
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleExpand(lead.id)}
                    >
                      <TableCell className="p-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {getServiceLabel(lead.serviceType)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusInfo.color}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={lead.status}
                            onValueChange={(v) =>
                              handleStatusChange(lead.id, v)
                            }
                          >
                            <SelectTrigger className="h-6 border-0 bg-transparent p-0 text-xs font-normal focus:ring-0 w-auto min-w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новый</SelectItem>
                              <SelectItem value="contacted">Контактированный</SelectItem>
                              <SelectItem value="qualified">Квалифицированный</SelectItem>
                              <SelectItem value="lost">Потерянный</SelectItem>
                            </SelectContent>
                          </Select>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-xs">
                        {formatDate(lead.createdAt)}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Удалить лид?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Лид &quot;{lead.name}&quot; будет удалён навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(lead.id)}
                                className="bg-red-700 hover:bg-red-800"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${lead.id}-expanded`}>
                        <TableCell colSpan={7} className="bg-gray-50 px-8 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-gray-700">
                                Информация
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                  <span className="text-gray-400 w-24">
                                    Телефон:
                                  </span>
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="text-red-700 hover:underline"
                                  >
                                    {lead.phone}
                                  </a>
                                </div>
                                {lead.source && (
                                  <div className="flex gap-2">
                                    <span className="text-gray-400 w-24">
                                      Источник:
                                    </span>
                                    <span>{lead.source}</span>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <span className="text-gray-400 w-24">
                                    Создан:
                                  </span>
                                  <span>{formatDate(lead.createdAt)}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-400 w-24">
                                    Обновлён:
                                  </span>
                                  <span>{formatDate(lead.updatedAt)}</span>
                                </div>
                                {lead.comment && (
                                  <div className="flex gap-2">
                                    <span className="text-gray-400 w-24">
                                      Комментарий:
                                    </span>
                                    <span>{lead.comment}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-700">
                                  Заметки
                                </h4>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() =>
                                      setExpandedId(null)
                                    }
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Закрыть
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-red-700 hover:bg-red-800"
                                    disabled={savingNotes === lead.id}
                                    onClick={() => handleSaveNotes(lead.id)}
                                  >
                                    <Save className="w-3 h-3 mr-1" />
                                    {savingNotes === lead.id
                                      ? "..."
                                      : "Сохранить"}
                                  </Button>
                                </div>
                              </div>
                              <Textarea
                                value={editNotes[lead.id] || ""}
                                onChange={(e) =>
                                  setEditNotes((prev) => ({
                                    ...prev,
                                    [lead.id]: e.target.value,
                                  }))
                                }
                                placeholder="Добавьте заметки по лиду..."
                                rows={5}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {leads.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Всего: {leads.length} лидов
        </p>
      )}
    </div>
  );
}