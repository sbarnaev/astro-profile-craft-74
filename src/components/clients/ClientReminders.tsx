
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Bell, Calendar, Check, AlarmClock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Пример данных о напоминаниях
const remindersData = [
  { 
    id: 1,
    clientId: 1,
    date: new Date(2025, 3, 15),
    title: "Позвонить и предложить консультацию",
    description: "Обсудить результаты последнего анализа и предложить консультацию",
    completed: false,
    priority: "high"
  },
  { 
    id: 2,
    clientId: 1,
    date: new Date(2025, 2, 25),
    title: "Отправить материалы",
    description: "Отправить дополнительные материалы по личностному развитию",
    completed: true,
    priority: "medium"
  },
  { 
    id: 3,
    clientId: 1,
    date: new Date(2025, 4, 5),
    title: "Напомнить о предстоящей консультации",
    description: "Напомнить о консультации 10 апреля",
    completed: false,
    priority: "low"
  },
  { 
    id: 4,
    clientId: 2,
    date: new Date(2025, 3, 2),
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
  // Фильтрация напоминаний для текущего клиента и сортировка по дате и статусу
  const clientReminders = remindersData
    .filter(reminder => reminder.clientId === clientId)
    .sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Сначала активные
      }
      return a.date.getTime() - b.date.getTime(); // Затем по дате (сначала ближайшие)
    });
  
  const activeReminders = clientReminders.filter(r => !r.completed);
  const completedReminders = clientReminders.filter(r => r.completed);
  
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
    // В реальном приложении здесь был бы API-запрос для изменения статуса
    toast.success("Напоминание выполнено", {
      description: "Напоминание помечено как выполненное"
    });
  };

  return (
    <div className="space-y-6">
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
                <div key={reminder.id} className="flex flex-col md:flex-row md:items-start justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{reminder.title}</span>
                      <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
                        {getPriorityLabel(reminder.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatReminderDate(reminder.date)}</span>
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
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/reminders/${reminder.id}/edit`}>
                        Изменить
                      </Link>
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
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatReminderDate(reminder.date)}</span>
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
          <Button asChild>
            <Link to={`/reminders/new?client=${clientId}`}>
              <AlarmClock className="mr-2 h-4 w-4" />
              Создать напоминание
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
