"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Phone,
  Mail,
  MessageCircle,
  UserCircle,
  Edit,
  Trash2,
  Handshake,
  UserPlus,
  Download,
  Upload,
  Send,
  Copy,
  Tag,
  History,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  telegram: string | null;
  telegramHandle: string | null;
  notes: string | null;
  tags: string | null;
  source: string | null;
  createdAt: string;
  leadId: string | null;
  deals: { id: string; title: string }[];
  lead?: { id: string; name: string; phone: string; status: string } | null;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

interface TimelineEntry {
  id: string;
  action: string;
  details: string;
  createdAt: string;
  entityType?: string;
}

const PREDEFINED_TAGS = ["VIP", "Покупатель", "Продавец", "Инвестор", "Арендатор", "Новостройка", "Вторичный рынок"];

const TAG_PALETTE = [
  { bg: "bg-red-100", text: "text-red-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
];

const TIMELINE_COLORS: Record<string, string> = {
  create: "bg-green-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
  stage_change: "bg-amber-500",
};

function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

function getTimelineColor(action: string): string {
  if (action.includes("Создан") || action.includes("создан") || action.includes("Новый") || action.includes("новый")) return TIMELINE_COLORS.create;
  if (action.includes("Удалён") || action.includes("удалён")) return TIMELINE_COLORS.delete;
  if (action.includes("стадия") || action.includes("Стадия") || action.includes("перемещ")) return TIMELINE_COLORS.stage_change;
  return TIMELINE_COLORS.update;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [timelineClient, setTimelineClient] = useState<Client | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    notes: "",
    leadId: "",
    tags: "",
    source: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (tagFilter) params.set("tags", tagFilter);
      const [clientsRes, leadsRes] = await Promise.all([
        fetch(`/api/admin/clients${tagFilter ? `?${params}` : ""}`),
        fetch("/api/admin/leads?status=new"),
      ]);
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (leadsRes.ok) setLeads((await leadsRes.json()).leads);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [tagFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", telegram: "", notes: "", leadId: "", tags: "", source: "" });
    setEditingClient(null);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      phone: client.phone,
      email: client.email || "",
      telegram: client.telegram || "",
      notes: client.notes || "",
      leadId: client.leadId || "",
      tags: parseTags(client.tags).join(", "),
      source: client.source || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Имя и телефон обязательны");
      return;
    }
    try {
      const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const body = {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        telegram: form.telegram || null,
        notes: form.notes || null,
        leadId: form.leadId || null,
        tags: JSON.stringify(tagsArr),
        source: form.source || null,
      };

      if (editingClient) {
        const res = await fetch("/api/admin/clients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingClient.id, ...body }),
        });
        if (res.ok) toast.success("Клиент обновлён");
      } else {
        const res = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) toast.success("Клиент создан");
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Клиент удалён");
        fetchData();
      }
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const handleConvertLead = async () => {
    if (!form.leadId) {
      toast.error("Выберите лид");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Имя и телефон обязательны");
      return;
    }
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          telegram: form.telegram || null,
          notes: form.notes || null,
          leadId: form.leadId,
        }),
      });
      if (res.ok) {
        toast.success("Клиент создан из лида");
        setConvertDialogOpen(false);
        resetForm();
        fetchData();
      }
    } catch {
      toast.error("Ошибка конвертации");
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      const res = await fetch("/api/admin/import/clients", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        toast.success(`Импортировано: ${json.count} клиентов`);
        setImportOpen(false);
        setImportFile(null);
        fetchData();
      } else {
        toast.error("Ошибка импорта");
      }
    } catch {
      toast.error("Ошибка импорта");
    } finally {
      setImporting(false);
    }
  };

  const openTimeline = async (client: Client) => {
    setTimelineClient(client);
    setTimelineLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}/timeline`);
      if (res.ok) {
        const json = await res.json();
        setTimeline(Array.isArray(json) ? json : json.timeline || []);
      }
    } catch {
      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/templates");
      if (res.ok) {
        const json = await res.json();
        setTemplates(Array.isArray(json) ? json : json.templates || []);
      }
    } catch {
      // silent
    }
  };

  const copyTemplate = async (template: MessageTemplate, clientName: string) => {
    const text = template.content.replace(/\{name\}/gi, clientName);
    await navigator.clipboard.writeText(text);
    toast.success("Шаблон скопирован");
  };

  const getPhoneDigits = (phone: string) => phone.replace(/\D/g, "");

  const filteredClients = clients.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск клиентов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={tagFilter} onValueChange={(v) => setTagFilter(v === "__all__" ? "" : v)}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
              <SelectValue placeholder="Все теги" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Все теги</SelectItem>
              {PREDEFINED_TAGS.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => window.open("/api/admin/export/clients")}>
            <Download className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Экспорт CSV</span>
          </Button>
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Импорт CSV</span>
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Импорт клиентов из CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>Отмена</Button>
                <Button className="bg-red-700 hover:bg-red-800" onClick={handleImport} disabled={!importFile || importing}>
                  {importing ? "Импорт..." : "Импортировать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Convert lead dialog */}
          <Dialog open={convertDialogOpen} onOpenChange={(open) => { setConvertDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Из лида</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Конвертировать лида в клиента</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Выберите лида</Label>
                  <Select
                    value={form.leadId}
                    onValueChange={(v) => {
                      const lead = leads.find((l) => l.id === v);
                      setForm({
                        ...form,
                        leadId: v,
                        name: lead?.name || form.name,
                        phone: lead?.phone || form.phone,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите лида" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name} — {l.phone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {leads.length === 0 && <p className="text-xs text-gray-400">Нет новых лидов</p>}
                </div>
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setConvertDialogOpen(false); resetForm(); }}>Отмена</Button>
                <Button className="bg-red-700 hover:bg-red-800" onClick={handleConvertLead}>Создать клиента</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-red-700 hover:bg-red-800" onClick={openNew} size="sm">
                <Plus className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Новый клиент</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingClient ? "Редактировать клиента" : "Новый клиент"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Телефон *</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telegram</Label>
                    <Input value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Источник</Label>
                    <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Сайт, ЦИАН, ..."/>
                  </div>
                  <div className="space-y-2">
                    <Label>Теги</Label>
                    <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="VIP, Покупатель, ..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Быстрые теги</Label>
                  <div className="flex flex-wrap gap-1">
                    {PREDEFINED_TAGS.map((tag) => {
                      const isSelected = form.tags.split(",").map((t) => t.trim()).includes(tag);
                      const c = getTagColor(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${isSelected ? `${c.bg} ${c.text} border-transparent` : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                          onClick={() => {
                            const current = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
                            const next = isSelected ? current.filter((t) => t !== tag) : [...current, tag];
                            setForm({ ...form, tags: next.join(", ") });
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Заметки</Label>
                  <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Отмена</Button>
                <Button className="bg-red-700 hover:bg-red-800" onClick={handleSave}>
                  {editingClient ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Client cards */}
      {filteredClients.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Клиенты не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const tags = parseTags(client.tags);
            const phoneDigits = getPhoneDigits(client.phone);
            const tgLink = client.telegramHandle
              ? `https://t.me/${client.telegramHandle.replace("@", "")}`
              : phoneDigits
                ? `https://t.me/+7${phoneDigits}`
                : null;

            return (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{client.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                        <p className="text-xs text-gray-400">с {formatDate(client.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={() => openTimeline(client)} title="История">
                        <History className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600" onClick={() => openEdit(client)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить клиента?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Клиент &quot;{client.name}&quot; и все связанные данные будут удалены.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(client.id)} className="bg-red-700 hover:bg-red-800">Удалить</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tags.map((tag) => {
                        const c = getTagColor(tag);
                        return (
                          <Badge key={tag} variant="secondary" className={`text-[10px] ${c.bg} ${c.text}`}>{tag}</Badge>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-1.5 text-sm">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <a href={`tel:${client.phone}`} className="hover:text-red-700 transition-colors">{client.phone}</a>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <a href={`mailto:${client.email}`} className="hover:text-red-700 transition-colors truncate">{client.email}</a>
                      </div>
                    )}
                    {(client.telegram || client.telegramHandle) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                        {tgLink ? (
                          <a href={tgLink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors truncate">
                            {client.telegramHandle || client.telegram}
                          </a>
                        ) : (
                          <span className="truncate">{client.telegram}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {client.notes && (
                    <p className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded-lg line-clamp-2">
                      {client.notes}
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Handshake className="w-3.5 h-3.5" />
                        <span>{client.deals.length} сделок</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {tgLink && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-500" asChild>
                            <a href={tgLink} target="_blank" rel="noopener noreferrer" title="Telegram">
                              <Send className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600" asChild>
                          <a href="https://max.ru/" target="_blank" rel="noopener noreferrer" title="Max">
                            <span className="text-[10px] font-bold">M</span>
                          </a>
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600" onClick={fetchTemplates} title="Шаблоны">
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2" align="end">
                            <p className="text-xs font-semibold text-gray-600 px-2 pb-2">Шаблоны</p>
                            {templates.length === 0 && <p className="text-xs text-gray-400 px-2">Нет шаблонов</p>}
                            {templates.map((t) => (
                              <button
                                key={t.id}
                                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-100 text-xs transition-colors"
                                onClick={() => copyTemplate(t, client.name)}
                              >
                                <span className="font-medium">{t.name}</span>
                                <p className="text-gray-400 truncate mt-0.5">{t.content}</p>
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                        {client.leadId && (
                          <Badge variant="secondary" className="text-[10px]">Из лида</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredClients.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Всего: {filteredClients.length} клиентов
        </p>
      )}

      {/* Timeline Sheet */}
      <Sheet open={!!timelineClient} onOpenChange={(open) => { if (!open) setTimelineClient(null); }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              История: {timelineClient?.name}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {timelineLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : timeline.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Нет записей</p>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                {timeline.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative mb-6 last:mb-0">
                    <div className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-white ${getTimelineColor(entry.action)}`} />
                    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                      <p className="text-sm text-gray-800">{entry.details}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.createdAt).toLocaleDateString("ru-RU", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}