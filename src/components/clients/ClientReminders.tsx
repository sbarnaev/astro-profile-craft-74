
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Bell, Calendar, Check, AlarmClock, PlusCircle, Edit, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReminderForm } from "@/components/consultations/ReminderForm";

// Пример данных о напоминаниях
const initialRemindersData = [
  { 
    id: 1,
    clientId: 1,
    date: new Date(2025, 3, 15),
    time: "10:00",
    title: "Позвонить и предложить консультацию",
    description: "Обсудить результаты последнего анализа и предложить консультацию",
    completed: false,
    priority: "high"
  },
  { 
    id: 2,
    clientId: 1,
    date: new Date(2025, 2, 25),
    time: "15:30",
    title: "Отправить материалы",
    description: "Отправить дополнительные материалы по личностному развитию",
    completed: true,
    priority: "medium"
  },
  { 
    id: 3,
    clientId: 1,
    date: new Date(2025, 4, 5),
    time: "12:00",
    title: "Напомнить о предстоящей консультации",
    description: "Напомнить о консультации 10 апреля",
    completed: false,
    priority: "low"
  },
  { 
    id: 4,
    clientId: 2,
    date: new Date(2025, 3, 2),
    time: "14:45",
    title: "Обсудить результаты анализа",
    description: null,
    completed: false,
    priority: "medium"
  },
];

interface ClientRemindersProps {
  clientId: number;
}

export const ClientReminders = ({ clientId }: ClientRemindersProps) => {
  const [remindersData, setRemindersData] = useState(initialRemindersData);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<number | null>(null);
  
  // Фильтрация напоминаний для текущего клиента и сортировка по дате и статусу
  const clientReminders = remindersData
    .filter(reminder => reminder.clientId === clientId);
  
  const activeReminders = clientReminders.filter(r => !r.completed)
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Сначала ближайшие
  
  const completedReminders = clientReminders.filter(r => r.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Сначала недавние
  
  const formatReminderDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: ru });
  };
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return "Стандартный";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const handleCompleteReminder = (id: number) => {
    // Отметить напоминание как выполненное
    setRemindersData(prevData => 
      prevData.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: true } 
          : reminder
      )
    );
    
    toast.success("Напоминание выполнено", {
      description: "Напоминание помечено как выполненное"
    });
  };

  const handleEditReminder = (id: number) => {
    setEditingReminder(id);
    setIsReminderFormOpen(true);
  };

  const handleCreateReminder = (data: any) => {
    // Создать новое напоминание
    const newReminder = {
      id: Math.floor(Math.random() * 10000),
      clientId,
      date: data.date,
      time: data.time,
      title: data.text,
      description: null,
      completed: false,
      priority: data.priority
    };
    
    setRemindersData(prev => [...prev, newReminder]);
    setIsReminderFormOpen(false);
    
    toast.success("Напоминание создано", {
      description: "Новое напоминание добавлено в список"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Напоминания</h3>
        <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Создать напоминание
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Создать напоминание</DialogTitle>
            </DialogHeader>
            <ReminderForm 
              isOpen={isReminderFormOpen}
              onClose={() => setIsReminderFormOpen(false)}
              onSubmit={handleCreateReminder}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {activeReminders.length > 0 && (
        <Card className="border-none">
          <CardHeader className="pb-2">
            <CardTitle>Активные напоминания</CardTitle>
            <CardDescription>
              Текущие и предстоящие напоминания
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeReminders.map((reminder) => (
                <div id={`reminder-${reminder.id}`} key={reminder.id} className="flex flex-col md:flex-row md:items-start justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{reminder.title}</span>
                      <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                        {getPriorityLabel(reminder.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatReminderDate(reminder.date)}</span>
                      </div>
                      {reminder.time && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{reminder.time}</span>
                        </div>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-sm mt-2">{reminder.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button size="sm" variant="outline" onClick={() => handleCompleteReminder(reminder.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Выполнено
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditReminder(reminder.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Изменить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {completedReminders.length > 0 && (
        <Card className="border-none">
          <CardHeader className="pb-2">
            <CardTitle>Выполненные напоминания</CardTitle>
            <CardDescription>
              История напоминаний для клиента
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedReminders.map((reminder) => (
                <div key={reminder.id} className="flex flex-col md:flex-row md:items-start justify-between p-4 border rounded-lg opacity-70">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium line-through">{reminder.title}</span>
                      <Badge variant="outline">Выполнено</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatReminderDate(reminder.date)}</span>
                      </div>
                      {reminder.time && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{reminder.time}</span>
                        </div>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-sm mt-2 line-through">{reminder.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {clientReminders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Нет напоминаний</h3>
          <p className="text-muted-foreground mb-6">
            Для этого клиента нет активных или выполненных напоминаний
          </p>
          <Button onClick={() => setIsReminderFormOpen(true)}>
            <AlarmClock className="mr-2 h-4 w-4" />
            Создать напоминание
          </Button>
        </div>
      )}

      <Dialog open={editingReminder !== null} onOpenChange={(open) => !open && setEditingReminder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактировать напоминание</DialogTitle>
          </DialogHeader>
          <ReminderForm 
            isOpen={editingReminder !== null}
            onClose={() => setEditingReminder(null)}
            onSubmit={(data) => {
              // Обновление существующего напоминания
              setRemindersData(prev => prev.map(rem => 
                rem.id === editingReminder 
                  ? {
                      ...rem,
                      date: data.date,
                      time: data.time,
                      title: data.text,
                      priority: data.priority
                    }
                  : rem
              ));
              setEditingReminder(null);
              toast.success("Напоминание обновлено", {
                description: "Изменения сохранены"
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
