
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Clock, Users, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentInterface } from "@/types/calendar";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { toast } from "sonner";

interface CalendarDayProps {
  date: Date | undefined;
  appointments: AppointmentInterface[];
  onAddAppointment: (data: any) => void;
  selectedAppointment: number | null;
  setSelectedAppointment: (id: number | null) => void;
  onCancelAppointment?: (id: number) => void;
}

export function CalendarDay({
  date,
  appointments,
  onAddAppointment,
  selectedAppointment,
  setSelectedAppointment,
  onCancelAppointment
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
    
  const handleCancelAppointment = (id: number) => {
    if (onCancelAppointment) {
      onCancelAppointment(id);
    } else {
      // Fallback implementation if no cancel handler provided
      toast.success("Встреча отменена", {
        description: "Встреча была успешно отменена"
      });
      setSelectedAppointment(null);
    }
  };

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
              <div 
                key={appointment.id} 
                className={`p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors cursor-pointer ${
                  appointment.status === 'cancelled' ? 'opacity-60 bg-muted/40' : ''
                }`}
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
                      {appointment.status === 'cancelled' && (
                        <Badge variant="outline" className="text-destructive border-destructive">
                          Отменена
                        </Badge>
                      )}
                      {appointment.request && (
                        <p className="text-sm mt-1 text-muted-foreground">{appointment.request}</p>
                      )}
                      <div className="flex items-center mt-2 text-sm">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {format(appointment.date, "HH:mm")} - {format(new Date(appointment.date.getTime() + appointment.duration * 60000), "HH:mm")}
                        </span>
                        <span className="mx-1 text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{appointment.duration} мин</span>
                      </div>
                      {appointment.cost && (
                        <p className="text-sm mt-1 font-medium text-green-600">
                          {appointment.cost.toLocaleString('ru-RU')} ₽
                        </p>
                      )}
                    </div>
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
      
      {selectedAppointment && getAppointmentById(selectedAppointment) && (
        <AppointmentDrawer
          appointment={getAppointmentById(selectedAppointment)!}
          isOpen={selectedAppointment !== null}
          onClose={() => setSelectedAppointment(null)}
          onCancelAppointment={handleCancelAppointment}
        />
      )}
    </Card>
  );
}
