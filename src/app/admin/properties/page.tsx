"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Plus,
  Building2,
  MapPin,
  ExternalLink,
  Edit,
  Trash2,
  Home,
  Maximize,
  DollarSign,
  DoorOpen,
  X,
  Download,
  ImageIcon,
  Clock,
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  available: { label: "Доступно", color: "bg-green-100 text-green-700" },
  reserved: { label: "Бронь", color: "bg-yellow-100 text-yellow-700" },
  sold: { label: "Продано", color: "bg-red-100 text-red-700" },
};

const TYPE_MAP: Record<string, string> = {
  apartment: "Квартира",
  house: "Дом",
  commercial: "Коммерческая",
  land: "Участок",
};

interface Property {
  id: string;
  title: string;
  address: string | null;
  type: string | null;
  rooms: number | null;
  area: number | null;
  price: number | null;
  status: string;
  cianUrl: string | null;
  description: string | null;
  imageUrls: string | null;
  createdAt: string;
}

function parseImageUrls(imageUrls: string | null): string[] {
  if (!imageUrls) return [];
  try {
    const parsed = JSON.parse(imageUrls);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getDaysOnMarket(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [form, setForm] = useState({
    title: "",
    address: "",
    type: "apartment",
    rooms: "",
    area: "",
    price: "",
    status: "available",
    cianUrl: "",
    description: "",
    imageUrls: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  // Cian import state
  const [cianDialogOpen, setCianDialogOpen] = useState(false);
  const [cianUrl, setCianUrl] = useState("");
  const [cianImporting, setCianImporting] = useState(false);
  const [cianError, setCianError] = useState("");

  const fetchProperties = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/properties?${params}`);
      if (res.ok) setProperties(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    fetchProperties();
  }, [fetchProperties]);

  const resetForm = () => {
    setForm({
      title: "", address: "", type: "apartment", rooms: "", area: "",
      price: "", status: "available", cianUrl: "", description: "", imageUrls: [],
    });
    setNewImageUrl("");
    setEditingProperty(null);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (prop: Property) => {
    setEditingProperty(prop);
    setForm({
      title: prop.title,
      address: prop.address || "",
      type: prop.type || "apartment",
      rooms: prop.rooms ? String(prop.rooms) : "",
      area: prop.area ? String(prop.area) : "",
      price: prop.price ? String(prop.price) : "",
      status: prop.status,
      cianUrl: prop.cianUrl || "",
      description: prop.description || "",
      imageUrls: parseImageUrls(prop.imageUrls),
    });
    setNewImageUrl("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Введите название объекта");
      return;
    }
    try {
      const body = {
        title: form.title,
        address: form.address || null,
        type: form.type || null,
        rooms: form.rooms ? parseInt(form.rooms) : null,
        area: form.area ? parseFloat(form.area) : null,
        price: form.price ? parseFloat(form.price) : null,
        status: form.status,
        cianUrl: form.cianUrl || null,
        description: form.description || null,
        imageUrls: form.imageUrls.length > 0 ? JSON.stringify(form.imageUrls) : null,
      };

      if (editingProperty) {
        const res = await fetch("/api/admin/properties", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProperty.id, ...body }),
        });
        if (res.ok) toast.success("Объект обновлён");
      } else {
        const res = await fetch("/api/admin/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) toast.success("Объект создан");
      }
      setDialogOpen(false);
      resetForm();
      fetchProperties();
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/properties?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Объект удалён");
        fetchProperties();
      }
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    if (form.imageUrls.includes(url)) {
      toast.error("Этот URL уже добавлен");
      return;
    }
    setForm({ ...form, imageUrls: [...form.imageUrls, url] });
    setNewImageUrl("");
  };

  const removeImageUrl = (index: number) => {
    setForm({ ...form, imageUrls: form.imageUrls.filter((_, i) => i !== index) });
  };

  const handleCianImport = async () => {
    if (!cianUrl.trim()) {
      toast.error("Вставьте ссылку на объявление ЦИАН");
      return;
    }
    setCianImporting(true);
    setCianError("");
    try {
      const res = await fetch("/api/admin/properties/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cianUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        // Open the create dialog pre-filled
        setCianDialogOpen(false);
        setCianUrl("");
        setEditingProperty(null);
        setForm({
          title: data.title || "",
          address: data.address || "",
          type: data.rooms ? "apartment" : "apartment",
          rooms: data.rooms ? String(data.rooms) : "",
          area: data.area ? String(data.area) : "",
          price: data.price ? String(data.price) : "",
          status: "available",
          cianUrl: cianUrl.trim(),
          description: data.description || "",
          imageUrls: [],
        });
        setDialogOpen(true);
        toast.success("Данные загружены, проверьте и сохраните");
      } else {
        setCianError(data.error || "Не удалось извлечь данные");
        // Still open the dialog with whatever we got
        if (data.title || data.address) {
          setCianDialogOpen(false);
          setEditingProperty(null);
          setForm({
            title: data.title || "",
            address: data.address || "",
            type: data.rooms ? "apartment" : "apartment",
            rooms: data.rooms ? String(data.rooms) : "",
            area: data.area ? String(data.area) : "",
            price: data.price ? String(data.price) : "",
            status: "available",
            cianUrl: cianUrl.trim(),
            description: data.description || "",
            imageUrls: [],
          });
          setDialogOpen(true);
        }
      }
    } catch {
      setCianError("Ошибка подключения к парсеру");
    } finally {
      setCianImporting(false);
    }
  };

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(val);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="available">Доступные</TabsTrigger>
            <TabsTrigger value="reserved">Бронь</TabsTrigger>
            <TabsTrigger value="sold">Продано</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {/* Cian import button */}
          <Dialog open={cianDialogOpen} onOpenChange={setCianDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Импорт с ЦИАН
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Импорт с ЦИАН</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>URL объявления</Label>
                  <Input
                    value={cianUrl}
                    onChange={(e) => { setCianUrl(e.target.value); setCianError(""); }}
                    placeholder="https://cian.ru/sale/flat/..."
                  />
                </div>
                {cianError && (
                  <p className="text-xs text-red-500">{cianError}</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setCianDialogOpen(false); setCianError(""); }}>
                  Отмена
                </Button>
                <Button
                  className="bg-red-700 hover:bg-red-800"
                  onClick={handleCianImport}
                  disabled={cianImporting || !cianUrl.trim()}
                >
                  {cianImporting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  ) : (
                    <Download className="w-4 h-4 mr-1" />
                  )}
                  Импорт
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-red-700 hover:bg-red-800" onClick={openNew}>
                <Plus className="w-4 h-4 mr-1" />
                Новый объект
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProperty ? "Редактировать объект" : "Новый объект"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="2-к квартира, 65 м², Невский р-н"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Адрес</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="ул. Ленина, д. 10, кв. 5"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Тип</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) => setForm({ ...form, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Квартира</SelectItem>
                        <SelectItem value="house">Дом</SelectItem>
                        <SelectItem value="commercial">Коммерческая</SelectItem>
                        <SelectItem value="land">Участок</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Статус</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Доступно</SelectItem>
                        <SelectItem value="reserved">Бронь</SelectItem>
                        <SelectItem value="sold">Продано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Комнаты</Label>
                    <Input
                      type="number"
                      value={form.rooms}
                      onChange={(e) => setForm({ ...form, rooms: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Площадь (м²)</Label>
                    <Input
                      type="number"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      placeholder="65"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Цена (₽)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="8500000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ссылка ЦИАН</Label>
                  <Input
                    value={form.cianUrl}
                    onChange={(e) => setForm({ ...form, cianUrl: e.target.value })}
                    placeholder="https://cian.ru/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Описание объекта недвижимости..."
                    rows={4}
                  />
                </div>

                {/* Photo gallery management */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                    Фотографии ({form.imageUrls.length})
                  </Label>

                  {/* Existing photos grid */}
                  {form.imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {form.imageUrls.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={url}
                            alt={`Фото ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add photo URL */}
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addImageUrl();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
                      Добавить
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Отмена
                </Button>
                <Button className="bg-red-700 hover:bg-red-800" onClick={handleSave}>
                  {editingProperty ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Property cards */}
      {properties.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Объекты не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop) => {
            const statusInfo = STATUS_MAP[prop.status] || STATUS_MAP.available;
            const images = parseImageUrls(prop.imageUrls);
            const days = getDaysOnMarket(prop.createdAt);
            const showDaysBadge = prop.status === "available";
            let daysBadgeClass = "";
            let daysText = "";
            if (showDaysBadge) {
              if (days > 60) {
                daysBadgeClass = "bg-red-100 text-red-700";
                daysText = `${days} дн.`;
              } else if (days > 30) {
                daysBadgeClass = "bg-amber-100 text-amber-700";
                daysText = `${days} дн.`;
              } else {
                daysBadgeClass = "bg-gray-100 text-gray-600";
                daysText = `${days} дн.`;
              }
            }
            return (
              <Card key={prop.id} className="hover:shadow-md transition-shadow overflow-hidden">
                {/* Photo thumbnail */}
                {images.length > 0 && (
                  <div className="relative w-full h-40 bg-gray-100">
                    <Image
                      src={images[0]}
                      alt={prop.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {images.length > 1 && (
                      <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] h-5">
                        <ImageIcon className="w-3 h-3 mr-0.5" />
                        {images.length}
                      </Badge>
                    )}
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="secondary" className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                      {showDaysBadge && (
                        <Badge variant="secondary" className={`text-[10px] h-5 ${daysBadgeClass}`}>
                          <Clock className="w-2.5 h-2.5 mr-0.5" />
                          {daysText}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {prop.cianUrl && (
                        <a href={prop.cianUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        onClick={() => openEdit(prop)}
                      >
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
                            <AlertDialogTitle>Удалить объект?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Объект &quot;{prop.title}&quot; будет удалён навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(prop.id)}
                              className="bg-red-700 hover:bg-red-800"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{prop.title}</h3>

                  {prop.address && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{prop.address}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                    {prop.type && (
                      <div className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-gray-400" />
                        {TYPE_MAP[prop.type] || prop.type}
                      </div>
                    )}
                    {prop.rooms != null && (
                      <div className="flex items-center gap-1">
                        <DoorOpen className="w-3.5 h-3.5 text-gray-400" />
                        {prop.rooms} комн.
                      </div>
                    )}
                    {prop.area != null && (
                      <div className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-gray-400" />
                        {prop.area} м²
                      </div>
                    )}
                  </div>

                  {prop.price != null && prop.price > 0 && (
                    <div className="flex items-center gap-1 text-red-700 font-semibold text-sm">
                      <DollarSign className="w-4 h-4" />
                      {formatMoney(prop.price)}
                    </div>
                  )}

                  {prop.description && (
                    <p className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-lg line-clamp-2">
                      {prop.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {properties.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Всего: {properties.length} объектов
        </p>
      )}
    </div>
  );
}