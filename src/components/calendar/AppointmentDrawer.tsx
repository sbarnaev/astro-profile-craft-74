
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Users, Eye, DollarSign, X, Edit, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Link } from "react-router-dom";
import { AppointmentInterface } from "@/types/calendar";
import { AppointmentForm } from "./AppointmentForm";
import { toast } from "sonner";

interface AppointmentDrawerProps {
  appointment: AppointmentInterface;
  isOpen: boolean;
  onClose: () => void;
  onCancelAppointment?: (id: number) => void;
}

export function AppointmentDrawer({ 
  appointment, 
  isOpen, 
  onClose,
  onCancelAppointment 
}: AppointmentDrawerProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleEditClose = () => {
    setShowEditForm(false);
  };

  const handleEditSubmit = (updatedData: any) => {
    console.log("Обновленные данные встречи:", updatedData);
    // В реальном приложении здесь должен быть код для обновления встречи
    setShowEditForm(false);
  };
  
  const handleCancelAppointment = () => {
    if (onCancelAppointment && appointment.id) {
      onCancelAppointment(appointment.id);
      onClose();
    } else {
      toast.error("Не удалось отменить встречу");
    }
  };
  
  // Make sure clientName is not undefined and has the expected format
  const clientName = appointment.clientName || "";
  // Extract the client name parts correctly
  const nameParts = clientName.split(' ');
  const clientInfo = {
    id: appointment.clientId || 0,
    firstName: nameParts[1] || "",
    lastName: nameParts[0] || "",
    patronymic: nameParts[2] || "",
    // Add these properties to avoid undefined errors
    phone: "",
    email: ""
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Детали консультации</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{appointment.clientName || "Клиент"}</h3>
                {appointment.clientId ? (
                  <Link 
                    to={`/clients/${appointment.clientId}`} 
                    className="text-sm text-primary hover:underline"
                  >
                    Профиль клиента
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">Клиент не выбран</span>
                )}
              </div>
            </div>
            <Badge>{appointment.type || "Консультация"}</Badge>
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
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Стоимость</p>
                <p className="font-medium text-lg text-green-600">
                  {(appointment.cost || 3500).toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/consultations?id=${appointment.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  Полная информация
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
            <p>{appointment.request || "Нет информации"}</p>
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Связанные анализы</p>
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
            <Button variant="outline" onClick={handleEditClick}>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Отменить встречу
            </Button>
          </div>
        </div>

        {showEditForm && (
          <AppointmentForm
            isOpen={showEditForm}
            onClose={handleEditClose}
            initialDate={appointment.date}
            initialTime={format(appointment.date, "HH:mm")}
            initialClient={clientInfo}
            onSubmit={handleEditSubmit}
            isEditing={true}
            editData={{
              cost: appointment.cost,
              request: appointment.request,
              consultationType: appointment.type 
                ? ["Экспресс-консультация", "Базовый анализ", "Отношения", "Целевой анализ"].indexOf(appointment.type) + 1 || 1 
                : 1
            }}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
