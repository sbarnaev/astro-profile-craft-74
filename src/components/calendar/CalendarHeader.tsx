
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  onAddAppointment: () => void;
}

export function CalendarHeader({ onAddAppointment }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Календарь</h1>
        <p className="text-muted-foreground">Планирование встреч с клиентами</p>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90"
        onClick={onAddAppointment}
      >
        <Plus className="mr-2 h-4 w-4" />
        Добавить встречу
      </Button>
    </div>
  );
}
