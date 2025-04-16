import React, { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isToday,
  getDay,
  isWeekend,
  isPast
} from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentInterface } from "@/types/calendar";
import { AppointmentDrawer } from "./AppointmentDrawer";

// Russian holidays (some major ones for example)
const russianHolidays = [
  "01-01", // New Year
  "01-02", // New Year holidays
  "01-03", // New Year holidays
  "01-04", // New Year holidays
  "01-05", // New Year holidays
  "01-06", // New Year holidays
  "01-07", // Christmas
  "02-23", // Defender of the Fatherland Day
  "03-08", // International Women's Day
  "05-01", // Spring and Labor Day
  "05-09", // Victory Day
  "06-12", // Russia Day
  "11-04", // Unity Day
];

// Check if a date is a Russian holiday
const isRussianHoliday = (date: Date) => {
  const monthDay = format(date, "MM-dd");
  return russianHolidays.includes(monthDay);
};

interface DetailedMonthViewProps {
  currentDate: Date;
  appointments: AppointmentInterface[];
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
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  
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
  
  const getAppointmentById = (id: number) => {
    return appointments.find(appointment => appointment.id === id);
  };
  
  const handleAppointmentClick = (id: number) => {
    setSelectedAppointment(id);
    onAppointmentClick(id);
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
                          : isPast(day) 
                            ? "bg-gray-100"
                            : isRussianHoliday(day)
                              ? "bg-purple-100"
                              : isWeekend(day)
                                ? "bg-secondary/10"
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
                          isToday(day) ? "text-primary" : "",
                          isPast(day) ? "text-gray-500" : "",
                          isRussianHoliday(day) ? "text-purple-700" : ""
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
                              className={cn(
                                "text-xs p-1 rounded cursor-pointer hover:bg-primary/30 truncate",
                                isPast(day) ? "bg-gray-200 text-gray-600" : "bg-primary/20"
                              )}
                              onClick={() => handleAppointmentClick(appointment.id)}
                            >
                              <div className="flex flex-col">
                                <span>{format(appointment.date, 'HH:mm')} - {appointment.clientName}</span>
                                {appointment.request && (
                                  <span className="text-xs truncate opacity-80">{appointment.request}</span>
                                )}
                                {appointment.cost && (
                                  <span className="text-xs font-medium">{appointment.cost.toLocaleString('ru-RU')} ₽</span>
                                )}
                              </div>
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
        
        {selectedAppointment && getAppointmentById(selectedAppointment) && (
          <AppointmentDrawer
            appointment={getAppointmentById(selectedAppointment)!}
            isOpen={selectedAppointment !== null}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
