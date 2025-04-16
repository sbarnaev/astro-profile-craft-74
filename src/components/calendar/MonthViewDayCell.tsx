
import React from "react";
import { format, isSameMonth, isToday, isPast, isWeekend } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AppointmentInterface } from "@/types/calendar";
import { isRussianHoliday } from "./utils/russianHolidays";

interface MonthViewDayCellProps {
  day: Date | null;
  currentDate: Date;
  appointments: AppointmentInterface[];
  onAppointmentClick: (id: number) => void;
  onAddAppointment: (date: Date) => void;
}

export function MonthViewDayCell({
  day,
  currentDate,
  appointments,
  onAppointmentClick,
  onAddAppointment
}: MonthViewDayCellProps) {
  // Get appointments for this day
  const getAppointmentsForDay = (day: Date | null) => {
    if (!day) return [];
    return appointments.filter(appointment => 
      format(appointment.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  return (
    <div 
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
        ) : "bg-muted/20 text-muted-foreground"
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
              onClick={() => onAddAppointment(day)}
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
                  onClick={() => onAppointmentClick(appointment.id)}
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
  );
}
