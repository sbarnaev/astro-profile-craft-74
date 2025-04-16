
import { Bell, AlarmClock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRemindersStateProps {
  onCreateReminder: () => void;
}

export const EmptyRemindersState = ({ onCreateReminder }: EmptyRemindersStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Нет напоминаний</h3>
      <p className="text-muted-foreground mb-6">
        Для этого клиента нет активных или выполненных напоминаний
      </p>
      <Button onClick={onCreateReminder}>
        <AlarmClock className="mr-2 h-4 w-4" />
        Создать напоминание
      </Button>
    </div>
  );
};
