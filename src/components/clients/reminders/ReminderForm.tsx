
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ReminderFormProps {
  reminderText: string;
  setReminderText: (value: string) => void;
  reminderDate: Date | null;
  setReminderDate: (date: Date | null) => void;
  reminderDateText: string;
  setReminderDateText: (text: string) => void;
  reminderTime: string;
  setReminderTime: (time: string) => void;
  reminderPriority: string;
  setReminderPriority: (priority: string) => void;
  handleSubmitReminder: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const ReminderForm = ({
  reminderText,
  setReminderText,
  reminderDate,
  setReminderDate,
  reminderDateText,
  setReminderDateText,
  reminderTime,
  setReminderTime,
  reminderPriority,
  setReminderPriority,
  handleSubmitReminder,
  onCancel,
  isEditing
}: ReminderFormProps) => {
  
  const handleDateTextChange = (value: string) => {
    setReminderDateText(value);
    
    const parts = value.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
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
  
  return (
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
                  <CalendarIcon className="h-4 w-4" />
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
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button type="button" onClick={handleSubmitReminder}>
          {isEditing ? "Сохранить" : "Создать"}
        </Button>
      </div>
    </div>
  );
};
