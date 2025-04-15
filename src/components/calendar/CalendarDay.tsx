
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Clock, Users, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Link } from "react-router-dom";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentInterface } from "@/types/calendar";

interface CalendarDayProps {
  date: Date | undefined;
  appointments: AppointmentInterface[];
  onAddAppointment: (data: any) => void;
  selectedAppointment: number | null;
  setSelectedAppointment: (id: number | null) => void;
}

export function CalendarDay({
  date,
  appointments,
  onAddAppointment,
  selectedAppointment,
  setSelectedAppointment
}: CalendarDayProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Сортировка встреч по времени
  const sortedAppointments = [...appointments].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
  
  // Получение деталей встречи по ID
  const getAppointmentById = (id: number) => {
    return appointments.find(appointment => appointment.id === id);
  };
  
  // Детали выбранной встречи
  const selectedAppointmentDetails = selectedAppointment 
    ? getAppointmentById(selectedAppointment) 
    : null;

  return (
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
              <Drawer key={appointment.id}>
                <DrawerTrigger asChild>
                  <div 
                    className="p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment.id)}
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
                      <Badge variant="outline" className="shrink-0">
                        {appointment.type}
                      </Badge>
                    </div>
                  </div>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Детали консультации</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.clientName}</h3>
                          <Link 
                            to={`/clients/${appointment.clientId}`} 
                            className="text-sm text-primary hover:underline"
                          >
                            Профиль клиента
                          </Link>
                        </div>
                      </div>
                      <Badge>{appointment.type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Дата и время</p>
                        <p className="font-medium">
                          {format(appointment.date, "d MMMM yyyy, HH:mm", { locale: ru })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Продолжительность</p>
                        <p className="font-medium">{appointment.duration} минут</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
                      <p>{appointment.request}</p>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Связанные анализы</p>
                        <Button variant="outline" size="sm" className="h-8">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Новый анализ
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">Базовый анализ</p>
                            <p className="text-sm text-muted-foreground">Создан 12.03.2025</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/analysis/1`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Просмотр
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline">Редактировать</Button>
                      <Button variant="destructive">Отменить встречу</Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
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
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить встречу
            </Button>
          </div>
        )}
      </CardContent>
      
      <AppointmentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        initialDate={date}
        onSubmit={onAddAppointment}
      />
    </Card>
  );
}
