"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  telegram: string | null;
  notes: string | null;
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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: "",
    notes: "",
    leadId: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [clientsRes, leadsRes] = await Promise.all([
        fetch("/api/admin/clients"),
        fetch("/api/admin/leads?status=new"),
      ]);
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (leadsRes.ok) setLeads((await leadsRes.json()).leads);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", telegram: "", notes: "", leadId: "" });
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
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Имя и телефон обязательны");
      return;
    }
    try {
      const body = {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        telegram: form.telegram || null,
        notes: form.notes || null,
        leadId: form.leadId || null,
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
    if (!form.name.trim()) {
      toast.error("Введите имя клиента");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Введите телефон");
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
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск клиентов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {/* Convert lead dialog */}
          <Dialog open={convertDialogOpen} onOpenChange={(open) => { setConvertDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-1" />
                Из лида
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
                        <SelectItem key={l.id} value={l.id}>
                          {l.name} — {l.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {leads.length === 0 && (
                    <p className="text-xs text-gray-400">Нет новых лидов</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telegram</Label>
                  <Input
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setConvertDialogOpen(false); resetForm(); }}>
                  Отмена
                </Button>
                <Button className="bg-red-700 hover:bg-red-800" onClick={handleConvertLead}>
                  Создать клиента
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-red-700 hover:bg-red-800" onClick={openNew}>
                <Plus className="w-4 h-4 mr-1" />
                Новый клиент
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Редактировать клиента" : "Новый клиент"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Телефон *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telegram</Label>
                  <Input
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Заметки</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Отмена
                </Button>
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
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-xs text-gray-400">
                        с {formatDate(client.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={() => openEdit(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-600"
                        >
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
                          <AlertDialogAction
                            onClick={() => handleDelete(client.id)}
                            className="bg-red-700 hover:bg-red-800"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  {client.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${client.phone}`} className="hover:text-red-700 transition-colors">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`mailto:${client.email}`} className="hover:text-red-700 transition-colors truncate">
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.telegram && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span>{client.telegram}</span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <p className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded-lg line-clamp-2">
                    {client.notes}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Handshake className="w-3.5 h-3.5" />
                    <span>{client.deals.length} сделок</span>
                  </div>
                  {client.leadId && (
                    <Badge variant="secondary" className="text-[10px]">
                      Из лида
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredClients.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Всего: {filteredClients.length} клиентов
        </p>
      )}
    </div>
  );
}