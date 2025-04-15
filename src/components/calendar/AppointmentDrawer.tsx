
import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Users, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Link } from "react-router-dom";
import { AppointmentInterface } from "@/types/calendar";

interface AppointmentDrawerProps {
  appointment: AppointmentInterface;
}

export function AppointmentDrawer({ appointment }: AppointmentDrawerProps) {
  return (
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
  );
}
