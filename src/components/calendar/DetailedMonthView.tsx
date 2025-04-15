
import React, { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isToday,
  getDay,
  addDays,
  isWeekend
} from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AppointmentForm } from "./AppointmentForm";

interface Appointment {
  id: number;
  clientName: string;
  clientId: number;
  date: Date;
  duration: number;
  type: string;
  request: string;
}

interface DetailedMonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (id: number) => void;
  onAddAppointment: (data: any) => void;
}

export function DetailedMonthView({
  currentDate,
  appointments,
  onAppointmentClick,
  onAddAppointment
}: DetailedMonthViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Получаем первый день месяца
  const monthStart = startOfMonth(currentDate);
  
  // Получаем последний день месяца
  const monthEnd = endOfMonth(currentDate);
  
  // Получаем все дни месяца
  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
  
  // Получаем день недели для первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
  const startDay = getDay(monthStart);
  
  // Корректируем начальный день для русской локали (1 - понедельник, 7 - воскресенье)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
  
  // Дни недели для русской локали
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Создаем пустой массив для дней календаря
  const calendarDays = [];
  
  // Добавляем пустые ячейки для дней до начала месяца
  for (let i = 0; i < adjustedStartDay; i++) {
    calendarDays.push(null);
  }
  
  // Добавляем все дни месяца
  calendarDays.push(...daysInMonth);
  
  // Количество строк в календаре
  const totalSlots = Math.ceil(calendarDays.length / 7) * 7;
  
  // Добавляем пустые ячейки в конце для заполнения последней строки
  while (calendarDays.length < totalSlots) {
    calendarDays.push(null);
  }
  
  // Разбиваем дни на недели
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  // Получаем встречи для конкретного дня
  const getAppointmentsForDay = (day: Date | null) => {
    if (!day) return [];
    return appointments.filter(appointment => 
      format(appointment.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };
  
  const handleAddAppointment = (day: Date) => {
    setSelectedDate(day);
    setShowAddForm(true);
  };
  
  return (
    <Card className="astro-card border-none">
      <CardHeader className="pb-2">
        <CardTitle>
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={cn(
                "text-center py-2 text-sm font-semibold",
                index >= 5 ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex}
                  className={cn(
                    "min-h-[120px] rounded-md border p-1 relative",
                    day ? (
                      isSameMonth(day, currentDate)
                        ? isToday(day)
                          ? "bg-primary/10 border-primary"
                          : isWeekend(day)
                            ? "bg-accent/10"
                            : "bg-background"
                        : "bg-muted/20 text-muted-foreground"
                    ) : "bg-transparent border-transparent"
                  )}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={cn(
                          "text-sm font-medium",
                          isToday(day) ? "text-primary" : ""
                        )}>
                          {format(day, 'd')}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5"
                          onClick={() => handleAddAppointment(day)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[80px] mt-1">
                        <div className="space-y-1">
                          {getAppointmentsForDay(day).map((appointment) => (
                            <div 
                              key={appointment.id}
                              className="text-xs p-1 rounded bg-primary/20 cursor-pointer hover:bg-primary/30 truncate"
                              onClick={() => onAppointmentClick(appointment.id)}
                            >
                              {format(appointment.date, 'HH:mm')} - {appointment.clientName}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {showAddForm && selectedDate && (
          <AppointmentForm 
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            initialDate={selectedDate}
            onSubmit={onAddAppointment}
          />
        )}
      </CardContent>
    </Card>
  );
}
