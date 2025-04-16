
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReminderItem } from "./ReminderItem";

interface ReminderData {
  id: number;
  clientId: number;
  date: Date;
  time: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
}

interface RemindersListProps {
  reminders: ReminderData[];
  title: string;
  description: string;
  formatReminderDate: (date: Date) => string;
  getPriorityLabel: (priority: string) => string;
  getPriorityColor: (priority: string) => string;
  onComplete: (id: number) => void;
  onEdit: (id: number) => void;
}

export const RemindersList = ({
  reminders,
  title,
  description,
  formatReminderDate,
  getPriorityLabel,
  getPriorityColor,
  onComplete,
  onEdit
}: RemindersListProps) => {
  if (reminders.length === 0) {
    return null;
  }

  return (
    <Card className="border-none">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onComplete={onComplete}
              onEdit={onEdit}
              formatReminderDate={formatReminderDate}
              getPriorityLabel={getPriorityLabel}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
