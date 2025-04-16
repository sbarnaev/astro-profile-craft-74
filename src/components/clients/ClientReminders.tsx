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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderPriority, setReminderPriority] = useState("medium");
  const [reminderDateText, setReminderDateText] = useState("");
  
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
    const reminder = remindersData.find(r => r.id === id);
    if (reminder) {
      setReminderText(reminder.title);
      setReminderDate(reminder.date);
      setReminderDateText(format(reminder.date, "dd.MM.yyyy"));
      setReminderTime(reminder.time);
      setReminderPriority(reminder.priority);
      setEditingReminder(id);
      setIsReminderFormOpen(true);
    }
  };

  const resetReminderForm = () => {
    setReminderText("");
    setReminderDate(null);
    setReminderDateText("");
    setReminderTime("");
    setReminderPriority("medium");
  };

  const handleOpenNewReminderForm = () => {
    resetReminderForm();
    setIsReminderFormOpen(true);
  };

  const handleDateTextChange = (value: string) => {
    setReminderDateText(value);
    
    // Try to parse the date from text
    const parts = value.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Months are 0-indexed in JS Date
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const newDate = new Date(year, month, day);
        if (newDate.toString() !== "Invalid Date") {
          setReminderDate(newDate);
        }
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setReminderDate(date);
      setReminderDateText(format(date, "dd.MM.yyyy"));
    }
  };

  const handleSubmitReminder = () => {
    if (!reminderText || !reminderDate) {
      toast.error("Ошибка создания напоминания", {
        description: "Пожалуйста, заполните текст напоминания и выберите дату"
      });
      return;
    }

    if (editingReminder) {
      // Обновление существующего напоминания
      setRemindersData(prev => prev.map(rem => 
        rem.id === editingReminder 
          ? {
              ...rem,
              date: reminderDate,
              time: reminderTime,
              title: reminderText,
              priority: reminderPriority
            }
          : rem
      ));
      
      toast.success("Напоминание обновлено", {
        description: "Изменения сохранены"
      });
    } else {
      // Создать новое напоминание
      const newReminder = {
        id: Math.floor(Math.random() * 10000),
        clientId,
        date: reminderDate,
        time: reminderTime,
        title: reminderText,
        description: null,
        completed: false,
        priority: reminderPriority
      };
      
      setRemindersData(prev => [...prev, newReminder]);
      
      toast.success("Напоминание создано", {
        description: "Новое напоминание добавлено в список"
      });
    }
    
    setIsReminderFormOpen(false);
    setEditingReminder(null);
    resetReminderForm();
  };

  const ReminderForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reminder-text">Текст напоминания</Label>
        <Input 
          id="reminder-text" 
          value={reminderText} 
          onChange={(e) => setReminderText(e.target.value)}
          placeholder="Введите текст напоминания" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reminder-date">Дата</Label>
          <div className="flex space-x-2">
            <Input 
              id="reminder-date" 
              value={reminderDateText} 
              onChange={(e) => handleDateTextChange(e.target.value)}
              placeholder="ДД.ММ.ГГГГ" 
              className="flex-grow"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={reminderDate || undefined}
                  onSelect={handleCalendarSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reminder-time">Время</Label>
          <Input 
            id="reminder-time" 
            type="time" 
            value={reminderTime} 
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminder-priority">Приоритет</Label>
        <select
          id="reminder-priority"
          value={reminderPriority}
          onChange={(e) => setReminderPriority(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsReminderFormOpen(false);
            setEditingReminder(null);
            resetReminderForm();
          }}
        >
          Отмена
        </Button>
        <Button type="button" onClick={handleSubmitReminder}>
          {editingReminder ? "Сохранить" : "Создать"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Напоминания</h3>
        <Button size="sm" onClick={handleOpenNewReminderForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Создать напоминание
        </Button>
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
          <Button onClick={handleOpenNewReminderForm}>
            <AlarmClock className="mr-2 h-4 w-4" />
            Создать напоминание
          </Button>
        </div>
      )}

      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingReminder ? "Редактировать напоминание" : "Создать напоминание"}
            </DialogTitle>
          </DialogHeader>
          <ReminderForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
