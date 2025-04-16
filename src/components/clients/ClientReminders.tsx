import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import { RemindersList } from "./reminders/RemindersList";
import { ReminderForm } from "./reminders/ReminderForm";
import { EmptyRemindersState } from "./reminders/EmptyRemindersState";
import { getPriorityLabel, getPriorityColor } from "./reminders/utilities";
import { supabase } from "@/integrations/supabase/client";

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
  const [remindersData, setRemindersData] = useState<any[]>([]);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<number | null>(null);
  const [reminderText, setReminderText] = useState("");
  const [reminderDate, setReminderDate] = useState<Date | null>(new Date());
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderPriority, setReminderPriority] = useState("medium");
  const [reminderDateText, setReminderDateText] = useState(format(new Date(), "dd.MM.yyyy"));
  
  const clientReminders = remindersData
    .filter(reminder => reminder.clientId === clientId);
  
  const activeReminders = clientReminders.filter(r => !r.completed)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const completedReminders = clientReminders.filter(r => r.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const formatReminderDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: ru });
  };
  
  const handleCompleteReminder = (id: number) => {
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
    setReminderDate(new Date());
    setReminderDateText(format(new Date(), "dd.MM.yyyy"));
    setReminderTime("09:00");
    setReminderPriority("medium");
  };

  const handleOpenNewReminderForm = () => {
    resetReminderForm();
    setEditingReminder(null);
    setIsReminderFormOpen(true);
  };

  const handleCancelReminderForm = () => {
    setIsReminderFormOpen(false);
    setEditingReminder(null);
    resetReminderForm();
  };

  const handleSubmitReminder = async () => {
    if (!reminderText || !reminderDate) {
      toast.error("Заполните текст и дату напоминания");
      return;
    }

    const newReminder = {
      client_id: String(clientId), // Convert to string as expected by Supabase
      title: reminderText,
      date: format(reminderDate, "yyyy-MM-dd"),
      time: reminderTime,
      priority: reminderPriority,
      description: null,
      completed: false,
    };

    const { data, error } = await supabase
      .from('reminders')
      .insert(newReminder)
      .select();

    if (error) {
      toast.error("Не удалось создать напоминание");
      console.error(error);
    } else {
      // Process the returned data to match our component's data structure
      const processedReminder = {
        id: data[0].id,
        clientId: parseInt(data[0].client_id),
        date: new Date(data[0].date),
        time: data[0].time,
        title: data[0].title,
        description: data[0].description,
        completed: data[0].completed,
        priority: data[0].priority
      };
      
      setRemindersData(prev => [...prev, processedReminder]);
      toast.success("Напоминание сохранено");
      setIsReminderFormOpen(false);
      resetReminderForm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminderText(e.target.value);
  };

  const handlePriorityChange = (priority: string) => {
    setReminderPriority(priority);
  };

  useEffect(() => {
    // Fetch reminders for this client when component mounts
    const fetchReminders = async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('client_id', String(clientId)) // Convert to string as expected by Supabase
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Не удалось загрузить напоминания");
        console.error(error);
      } else {
        // Process reminders from supabase to match the format we use in the component
        const processedReminders = (data || []).map(reminder => ({
          id: reminder.id,
          clientId: parseInt(reminder.client_id),
          date: new Date(reminder.date),
          time: reminder.time,
          title: reminder.title,
          description: reminder.description,
          completed: reminder.completed,
          priority: reminder.priority
        }));
        setRemindersData(processedReminders);
      }
    };

    fetchReminders();
  }, [clientId]);

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
        <RemindersList
          reminders={activeReminders}
          title="Активные напоминания"
          description="Текущие и предстоящие напоминания"
          formatReminderDate={formatReminderDate}
          getPriorityLabel={getPriorityLabel}
          getPriorityColor={getPriorityColor}
          onComplete={handleCompleteReminder}
          onEdit={handleEditReminder}
        />
      )}
      
      {completedReminders.length > 0 && (
        <RemindersList
          reminders={completedReminders}
          title="Выполненные напоминания"
          description="История напоминаний для клиента"
          formatReminderDate={formatReminderDate}
          getPriorityLabel={getPriorityLabel}
          getPriorityColor={getPriorityColor}
          onComplete={handleCompleteReminder}
          onEdit={handleEditReminder}
        />
      )}
      
      {clientReminders.length === 0 && (
        <EmptyRemindersState onCreateReminder={handleOpenNewReminderForm} />
      )}

      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingReminder ? "Редактировать напоминание" : "Создать напоминание"}
            </DialogTitle>
            <DialogDescription>
              Заполните данные для создания напоминания
            </DialogDescription>
          </DialogHeader>
          <ReminderForm
            reminderText={reminderText}
            setReminderText={setReminderText}
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
            reminderDateText={reminderDateText}
            setReminderDateText={setReminderDateText}
            reminderTime={reminderTime}
            setReminderTime={setReminderTime}
            reminderPriority={reminderPriority}
            setReminderPriority={setReminderPriority}
            handleSubmitReminder={handleSubmitReminder}
            onCancel={handleCancelReminderForm}
            isEditing={editingReminder !== null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
