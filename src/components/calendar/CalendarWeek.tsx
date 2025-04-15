
import React from "react";
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WeekViewCell } from "./WeekViewCell";
import { AppointmentInterface } from "@/types/calendar";

interface CalendarWeekProps {
  currentWeek: Date;
  appointments: AppointmentInterface[];
  workHours: number[];
  onAppointmentClick: (id: number) => void;
  onAddAppointment: (data: any) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
}

export function CalendarWeek({
  currentWeek,
  appointments,
  workHours,
  onAppointmentClick,
  onAddAppointment,
  goToPrevWeek,
  goToNextWeek
}: CalendarWeekProps) {
  // Получение дней текущей недели
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Получение встреч для конкретного часа и дня
  const getAppointmentsForHourAndDay = (hour: number, day: Date) => {
    return appointments.filter(appointment => 
      format(appointment.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && 
      appointment.date.getHours() === hour
    );
  };

  return (
    <Card className="astro-card border-none">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>
            {format(weekStart, "d MMMM", { locale: ru })} - {format(weekEnd, "d MMMM yyyy", { locale: ru })}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={goToPrevWeek}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => currentWeek(new Date())}>
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 border-b pb-2">
          <div className="px-2 py-2 font-medium text-sm text-center">Время</div>
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={`px-2 py-2 text-center ${isToday(day) ? 'bg-primary/10 rounded-t-md' : ''}`}
            >
              <p className="font-medium">{format(day, "E", { locale: ru })}</p>
              <p className={`text-sm ${isToday(day) ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {format(day, "d", { locale: ru })}
              </p>
            </div>
          ))}
        </div>
        
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-8">
            {workHours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Временные слоты */}
                <div className="border-b border-r p-2 text-sm text-muted-foreground">
                  {hour}:00
                </div>
                
                {/* Дни недели */}
                {daysOfWeek.map((day, dayIndex) => (
                  <WeekViewCell
                    key={dayIndex}
                    day={day}
                    hour={hour}
                    appointments={getAppointmentsForHourAndDay(hour, day)}
                    onAppointmentClick={onAppointmentClick}
                    onAddAppointment={onAddAppointment}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
