
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Check, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReminderItemProps {
  reminder: {
    id: number;
    title: string;
    date: Date;
    time?: string;
    description: string | null;
    priority: string;
    completed: boolean;
  };
  onComplete: (id: number) => void;
  onEdit: (id: number) => void;
  formatReminderDate: (date: Date) => string;
  getPriorityLabel: (priority: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const ReminderItem = ({
  reminder,
  onComplete,
  onEdit,
  formatReminderDate,
  getPriorityLabel,
  getPriorityColor
}: ReminderItemProps) => {
  return (
    <div 
      id={`reminder-${reminder.id}`} 
      key={reminder.id} 
      className={`flex flex-col md:flex-row md:items-start justify-between p-4 border rounded-lg ${reminder.completed ? 'opacity-70' : ''}`}
    >
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`font-medium ${reminder.completed ? 'line-through' : ''}`}>
            {reminder.title}
          </span>
          {reminder.completed ? (
            <Badge variant="outline">Выполнено</Badge>
          ) : (
            <Badge variant="outline" className={getPriorityColor(reminder.priority)}>
              {getPriorityLabel(reminder.priority)}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatReminderDate(reminder.date)}
            </span>
          </div>
          {reminder.time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{reminder.time}</span>
            </div>
          )}
        </div>
        {reminder.description && (
          <p className={`text-sm mt-2 ${reminder.completed ? 'line-through' : ''}`}>
            {reminder.description}
          </p>
        )}
      </div>
      
      {!reminder.completed && (
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button size="sm" variant="outline" onClick={() => onComplete(reminder.id)}>
            <Check className="mr-2 h-4 w-4" />
            Выполнено
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(reminder.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Изменить
          </Button>
        </div>
      )}
    </div>
  );
};
