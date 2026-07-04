"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Download,
  Upload,
  Send,
  Copy,
  Tag,
  MessageSquare,
  CheckSquare,
  Plus,
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
  tags: string | null;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Контактированный", color: "bg-yellow-100 text-yellow-700" },
  qualified: { label: "Квалифицированный", color: "bg-green-100 text-green-700" },
  lost: { label: "Потерянный", color: "bg-red-100 text-red-700" },
};

const PREDEFINED_TAGS = ["VIP", "Покупатель", "Продавец", "Инвестор", "Арендатор", "Новостройка", "Вторичный рынок"];

const TAG_PALETTE = [
  { bg: "bg-red-100", text: "text-red-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
];

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});
  const [editTags, setEditTags] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [leadTasks, setLeadTasks] = useState<Record<string, { id: string; title: string; status: string; priority: string }[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick add lead state
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickAdding, setQuickAdding] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      if (tagFilter) params.set("tags", tagFilter);
      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || json);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, tagFilter]);

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
        body: JSON.stringify({ id, notes: editNotes[id] || "", tags: editTags[id] || "[]" }),
      });
      if (res.ok) {
        toast.success("Сохранено");
        fetchLeads();
      }
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setSavingNotes(null);
    }
  };

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const lead = leads.find((l) => l.id === id);
      if (lead) {
        setEditNotes((prev) => ({ ...prev, [id]: lead.notes || "" }));
        setEditTags((prev) => ({ ...prev, [id]: parseTags(lead.tags).join(", ") }));
      }
      // Fetch tasks for this lead
      try {
        const res = await fetch(`/api/admin/tasks?leadId=${id}`);
        if (res.ok) {
          const tasks = await res.json();
          setLeadTasks((prev) => ({ ...prev, [id]: tasks }));
        }
      } catch {
        // silent
      }
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);
      const res = await fetch("/api/admin/import/leads", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        toast.success(`Импортировано: ${json.count} лидов`);
        setImportOpen(false);
        setImportFile(null);
        fetchLeads();
      } else {
        toast.error("Ошибка импорта");
      }
    } catch {
      toast.error("Ошибка импорта");
    } finally {
      setImporting(false);
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

  const copyTemplate = async (template: MessageTemplate, leadName: string) => {
    const text = template.content.replace(/\{name\}/gi, leadName);
    await navigator.clipboard.writeText(text);
    toast.success("Шаблон скопирован");
  };

  const handleQuickAdd = async () => {
    if (!quickName.trim() || !quickPhone.trim()) {
      toast.error("Введите имя и телефон");
      return;
    }
    setQuickAdding(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: quickName.trim(), phone: quickPhone.trim() }),
      });
      if (res.ok) {
        toast.success("Лид добавлен");
        setQuickName("");
        setQuickPhone("");
        fetchLeads();
      } else {
        toast.error("Ошибка добавления");
      }
    } catch {
      toast.error("Ошибка добавления");
    } finally {
      setQuickAdding(false);
    }
  };

  const getPhoneDigits = (phone: string) => phone.replace(/\D/g, "");

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
      {/* Quick add lead bar */}
      <div className="bg-red-700 -mx-4 sm:-mx-0 px-4 py-3 rounded-lg sm:rounded-xl">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <span className="text-white text-sm font-medium hidden sm:block flex-shrink-0">
            Быстрое добавление:
          </span>
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <Input
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="Имя"
              className="bg-white/95 border-0 h-9 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (quickName.trim() && !quickPhone.trim()) {
                    // Focus phone field
                    document.getElementById("quick-phone-input")?.focus();
                  } else {
                    handleQuickAdd();
                  }
                }
              }}
            />
            <Input
              id="quick-phone-input"
              value={quickPhone}
              onChange={(e) => setQuickPhone(e.target.value)}
              placeholder="Телефон"
              type="tel"
              className="bg-white/95 border-0 h-9 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleQuickAdd();
                }
              }}
            />
          </div>
          <Button
            className="bg-white text-red-700 hover:bg-red-50 font-medium h-9 flex-shrink-0"
            onClick={handleQuickAdd}
            disabled={quickAdding || !quickName.trim() || !quickPhone.trim()}
          >
            {quickAdding ? (
              <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4 sm:mr-1" />
            )}
            <span className="hidden sm:inline">Быстро добавить</span>
            <span className="sm:hidden">Добавить</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="overflow-x-auto">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="new">Новые</TabsTrigger>
              <TabsTrigger value="contacted">Контактированные</TabsTrigger>
              <TabsTrigger value="qualified">Квалифицированные</TabsTrigger>
              <TabsTrigger value="lost">Потерянные</TabsTrigger>
            </TabsList>
          </Tabs>
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
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск по имени или телефону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => window.open("/api/admin/export/leads")}>
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
                <DialogTitle>Импорт лидов из CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-400">
                  Формат: Name, Phone, ServiceType, Status, Source, Comment
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>Отмена</Button>
                <Button
                  className="bg-red-700 hover:bg-red-800"
                  onClick={handleImport}
                  disabled={!importFile || importing}
                >
                  {importing ? "Импорт..." : "Импортировать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table - desktop */}
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
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Услуга</TableHead>
                    <TableHead>Теги</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const isExpanded = expandedId === lead.id;
                    const statusInfo = STATUS_MAP[lead.status] || STATUS_MAP.new;
                    const tags = parseTags(lead.tags);
                    return (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        isExpanded={isExpanded}
                        statusInfo={statusInfo}
                        tags={tags}
                        expandedId={expandedId}
                        editNotes={editNotes}
                        editTags={editTags}
                        savingNotes={savingNotes}
                        toggleExpand={toggleExpand}
                        handleStatusChange={handleStatusChange}
                        handleDelete={handleDelete}
                        handleSaveNotes={handleSaveNotes}
                        setEditNotes={setEditNotes}
                        setEditTags={setEditTags}
                        formatDate={formatDate}
                        getServiceLabel={getServiceLabel}
                        getPhoneDigits={getPhoneDigits}
                        fetchTemplates={fetchTemplates}
                        templates={templates}
                        copyTemplate={copyTemplate}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3 p-3">
              {leads.map((lead) => {
                const statusInfo = STATUS_MAP[lead.status] || STATUS_MAP.new;
                const tags = parseTags(lead.tags);
                const phoneDigits = getPhoneDigits(lead.phone);
                return (
                  <Card key={lead.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-medium text-sm truncate">{lead.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                          <Phone className="w-3.5 h-3.5" />
                          <a href={`tel:${lead.phone}`} className="hover:text-red-700">{lead.phone}</a>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`text-xs flex-shrink-0 ${statusInfo.color}`}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => {
                          const c = getTagColor(tag);
                          return (
                            <Badge key={tag} variant="secondary" className={`text-[10px] ${c.bg} ${c.text}`}>{tag}</Badge>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{getServiceLabel(lead.serviceType)}</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                      {phoneDigits && (
                        <Button variant="ghost" size="sm" className="h-9 text-xs" asChild>
                          <a href={`https://t.me/+7${phoneDigits}`} target="_blank" rel="noopener noreferrer">
                            <Send className="w-3.5 h-3.5 mr-1" /> Telegram
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-9 text-xs" asChild>
                        <a href="https://max.ru/" target="_blank" rel="noopener noreferrer">
                          Max
                        </a>
                      </Button>
                      <div className="ml-auto flex gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={fetchTemplates}>
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2" align="end">
                            <p className="text-xs font-semibold text-gray-600 px-2 pb-2">Шаблоны</p>
                            {templates.length === 0 && <p className="text-xs text-gray-400 px-2">Нет шаблонов</p>}
                            {templates.map((t) => (
                              <button
                                key={t.id}
                                className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-100 text-xs transition-colors"
                                onClick={() => copyTemplate(t, lead.name)}
                              >
                                <span className="font-medium">{t.name}</span>
                                <p className="text-gray-400 truncate mt-0.5">{t.content}</p>
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить лид?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Лид &quot;{lead.name}&quot; будет удалён навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(lead.id)} className="bg-red-700 hover:bg-red-800">Удалить</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
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

function LeadRow({
  lead,
  isExpanded,
  statusInfo,
  tags,
  expandedId,
  editNotes,
  editTags,
  savingNotes,
  toggleExpand,
  handleStatusChange,
  handleDelete,
  handleSaveNotes,
  setEditNotes,
  setEditTags,
  formatDate,
  getServiceLabel,
  getPhoneDigits,
  fetchTemplates,
  templates,
  copyTemplate,
  leadTasks,
}: {
  lead: Lead;
  isExpanded: boolean;
  statusInfo: { label: string; color: string };
  tags: string[];
  expandedId: string | null;
  editNotes: Record<string, string>;
  editTags: Record<string, string>;
  savingNotes: string | null;
  toggleExpand: (id: string) => Promise<void>;
  handleStatusChange: (id: string, status: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleSaveNotes: (id: string) => Promise<void>;
  setEditNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setEditTags: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  formatDate: (d: string) => string;
  getServiceLabel: (t: string | null) => string;
  getPhoneDigits: (p: string) => string;
  fetchTemplates: () => Promise<void>;
  templates: MessageTemplate[];
  copyTemplate: (t: MessageTemplate, name: string) => Promise<void>;
  leadTasks: Record<string, { id: string; title: string; status: string; priority: string }[]>;
}) {
  const phoneDigits = getPhoneDigits(lead.phone);

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
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => {
              const c = getTagColor(tag);
              return (
                <Badge key={tag} variant="secondary" className={`text-[10px] ${c.bg} ${c.text}`}>{tag}</Badge>
              );
            })}
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant="secondary"
            className={statusInfo.color}
            onClick={(e) => e.stopPropagation()}
          >
            <Select
              value={lead.status}
              onValueChange={(v) => handleStatusChange(lead.id, v)}
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
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            {phoneDigits && (
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-500" asChild>
                <a href={`https://t.me/+7${phoneDigits}`} target="_blank" rel="noopener noreferrer" title="Telegram">
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
                    onClick={() => copyTemplate(t, lead.name)}
                  >
                    <span className="font-medium">{t.name}</span>
                    <p className="text-gray-400 truncate mt-0.5">{t.content}</p>
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить лид?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Лид &quot;{lead.name}&quot; будет удалён навсегда.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(lead.id)} className="bg-red-700 hover:bg-red-800">Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow key={`${lead.id}-expanded`}>
          <TableCell colSpan={8} className="bg-gray-50 px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Информация</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24">Телефон:</span>
                    <a href={`tel:${lead.phone}`} className="text-red-700 hover:underline">{lead.phone}</a>
                    {phoneDigits && (
                      <>
                        {" · "}
                        <a href={`https://t.me/+7${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">Telegram</a>
                        {" · "}
                        <a href="https://max.ru/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline text-xs">Max</a>
                      </>
                    )}
                  </div>
                  {lead.source && (
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">Источник:</span>
                      <span>{lead.source}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24">Создан:</span>
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24">Обновлён:</span>
                    <span>{formatDate(lead.updatedAt)}</span>
                  </div>
                  {lead.comment && (
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-24">Комментарий:</span>
                      <span>{lead.comment}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">Теги</span>
                  </div>
                  <Input
                    value={editTags[lead.id] || ""}
                    onChange={(e) => setEditTags((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                    placeholder="VIP, Покупатель, ..."
                    className="text-sm"
                  />
                  <div className="flex flex-wrap gap-1">
                    {PREDEFINED_TAGS.map((tag) => {
                      const isSelected = (editTags[lead.id] || "").split(",").map((t) => t.trim()).includes(tag);
                      const c = getTagColor(tag);
                      return (
                        <button
                          key={tag}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${isSelected ? `${c.bg} ${c.text} border-transparent` : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                          onClick={() => {
                            const current = (editTags[lead.id] || "").split(",").map((t) => t.trim()).filter(Boolean);
                            const next = isSelected ? current.filter((t) => t !== tag) : [...current, tag];
                            setEditTags((prev) => ({ ...prev, [lead.id]: next.join(", ") }));
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Linked tasks */}
              {leadTasks[lead.id] && leadTasks[lead.id].length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-gray-500" />
                    Задачи ({leadTasks[lead.id].length})
                  </h4>
                  <div className="space-y-1">
                    {leadTasks[lead.id].map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-xs bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <span className={`${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
                        <Badge variant="secondary" className={`text-[9px] ml-auto h-4 ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {task.status === 'completed' ? 'Готово' : task.status === 'in_progress' ? 'В работе' : 'Ожидание'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">Заметки</h4>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toggleExpand(lead.id)}>
                      <X className="w-3 h-3 mr-1" />Закрыть
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-red-700 hover:bg-red-800"
                      disabled={savingNotes === lead.id}
                      onClick={() => handleSaveNotes(lead.id)}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      {savingNotes === lead.id ? "..." : "Сохранить"}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={editNotes[lead.id] || ""}
                  onChange={(e) => setEditNotes((prev) => ({ ...prev, [lead.id]: e.target.value }))}
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
}