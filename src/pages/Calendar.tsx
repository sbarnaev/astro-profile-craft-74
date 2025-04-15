
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Пример данных о встречах
const appointmentsData = [
  { 
    id: 1, 
    clientName: "Анна Смирнова", 
    date: new Date(2025, 3, 15, 10, 0), 
    duration: 60, 
    type: "Консультация" 
  },
  { 
    id: 2, 
    clientName: "Иван Петров", 
    date: new Date(2025, 3, 15, 13, 30), 
    duration: 90, 
    type: "Полный анализ" 
  },
  { 
    id: 3, 
    clientName: "Мария Иванова", 
    date: new Date(2025, 3, 16, 11, 0), 
    duration: 45, 
    type: "Консультация" 
  },
  { 
    id: 4, 
    clientName: "Александр Козлов", 
    date: new Date(2025, 3, 17, 15, 0), 
    duration: 60, 
    type: "Базовый анализ" 
  },
];

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Фильтрация встреч на выбранную дату
  const filteredAppointments = date 
    ? appointmentsData.filter(appointment => 
        appointment.date.getDate() === date.getDate() && 
        appointment.date.getMonth() === date.getMonth() && 
        appointment.date.getFullYear() === date.getFullYear()
      )
    : [];
  
  // Сортировка встреч по времени
  const sortedAppointments = [...filteredAppointments].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Календарь</h1>
          <p className="text-muted-foreground">Планирование встреч с клиентами</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Добавить встречу
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="astro-card border-none md:col-span-5 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Календарь</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ru}
              className="mx-auto"
            />
          </CardContent>
        </Card>

        <Card className="astro-card border-none md:col-span-7 lg:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle>
              {date ? (
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  {format(date, "d MMMM yyyy", { locale: ru })}
                </div>
              ) : (
                "Встречи"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedAppointments.length > 0 ? (
              <div className="space-y-4">
                {sortedAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="min-w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.clientName}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>
                              {format(appointment.date, "HH:mm")} - {format(new Date(appointment.date.getTime() + appointment.duration * 60000), "HH:mm")}
                            </span>
                            <span className="mx-1 text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{appointment.duration} мин</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-muted shrink-0">
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Нет запланированных встреч</h3>
                <p className="text-muted-foreground mt-1">
                  {date ? "На выбранную дату нет встреч" : "Выберите дату в календаре"}
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить встречу
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
