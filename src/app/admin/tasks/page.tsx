"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckSquare,
  Calendar,
  Edit,
  Trash2,
  UserCircle,
  AlertCircle,
} from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const PRIORITY_LABELS: Record<string, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "В ожидании",
  in_progress: "В работе",
  completed: "Выполнено",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  clientName: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    clientName: "",
  });

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      if (res.ok) setTasks(await res.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((t) =>
    statusFilter === "all" ? true : t.status === statusFilter
  );

  const resetForm = () => {
    setForm({ title: "", description: "", priority: "medium", dueDate: "", clientName: "" });
    setEditingTask(null);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      clientName: task.clientName || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Введите название задачи");
      return;
    }
    try {
      const body = {
        title: form.title,
        description: form.description || null,
        priority: form.priority,
        dueDate: form.dueDate || null,
        clientName: form.clientName || null,
      };

      if (editingTask) {
        const res = await fetch("/api/admin/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTask.id, ...body }),
        });
        if (res.ok) toast.success("Задача обновлена");
      } else {
        const res = await fetch("/api/admin/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) toast.success("Задача создана");
      }
      setDialogOpen(false);
      resetForm();
      fetchTasks();
    } catch {
      toast.error("Ошибка сохранения");
    }
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(newStatus === "completed" ? "Задача выполнена" : "Задача возвращена");
        fetchTasks();
      }
    } catch {
      toast.error("Ошибка обновления");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/tasks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Задача удалена");
        fetchTasks();
      }
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === "completed") return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
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
            <TabsTrigger value="pending">В ожидании</TabsTrigger>
            <TabsTrigger value="in_progress">В работе</TabsTrigger>
            <TabsTrigger value="completed">Выполнено</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-red-700 hover:bg-red-800" onClick={openNew}>
              <Plus className="w-4 h-4 mr-1" />
              Новая задача
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Редактировать задачу" : "Новая задача"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Название *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Позвонить клиенту по поводу..."
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Подробности задачи..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Приоритет</Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) => setForm({ ...form, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="low">Низкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Срок</Label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Клиент</Label>
                <Input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="Имя клиента (необязательно)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                Отмена
              </Button>
              <Button className="bg-red-700 hover:bg-red-800" onClick={handleSave}>
                {editingTask ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Задачи не найдены</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            const isCompleted = task.status === "completed";
            return (
              <Card
                key={task.id}
                className={`transition-all ${isCompleted ? "opacity-60" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleToggle(task)}
                        className="mt-0.5"
                      />
                    </div>

                    {/* Priority dot */}
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium text-sm ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Badge variant="secondary" className={`text-[10px] ${STATUS_BADGE[task.status]}`}>
                            {STATUS_LABELS[task.status]}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-gray-600"
                            onClick={() => openEdit(task)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Удалить задачу?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Задача &quot;{task.title}&quot; будет удалена навсегда.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(task.id)}
                                  className="bg-red-700 hover:bg-red-800"
                                >
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}
                          />
                          {PRIORITY_LABELS[task.priority]}
                        </span>

                        {task.clientName && (
                          <span className="flex items-center gap-1">
                            <UserCircle className="w-3 h-3" />
                            {task.clientName}
                          </span>
                        )}

                        {task.dueDate && (
                          <span
                            className={`flex items-center gap-1 ${overdue ? "text-red-500 font-medium" : ""}`}
                          >
                            {overdue && <AlertCircle className="w-3 h-3" />}
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                            {overdue && " (просрочено)"}
                          </span>
                        )}

                        {!isCompleted && task.dueDate && overdue && (
                          <Badge variant="secondary" className="bg-red-100 text-red-600 text-[10px] h-5">
                            Просрочено
                          </Badge>
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

      {filteredTasks.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Всего: {filteredTasks.length} задач
        </p>
      )}
    </div>
  );
}