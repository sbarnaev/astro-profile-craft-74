
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Eye, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getConsultationTypeText } from "./ConsultationList";

interface ConsultationDetailsProps {
  consultation: any;
  onAddReminder: () => void;
}

export function ConsultationDetails({ consultation, onAddReminder }: ConsultationDetailsProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "info";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Запланирована";
      case "completed":
        return "Завершена";
      default:
        return "Неизвестно";
    }
  };

  const getFormatText = (format: string) => {
    switch (format) {
      case "video":
        return "Видео-консультация";
      case "in-person":
        return "Очная встреча";
      default:
        return "Консультация";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Badge variant={getBadgeVariant(consultation.status)} className="mb-2">
            {getStatusText(consultation.status)}
          </Badge>
          <h3 className="text-lg font-medium">{getConsultationTypeText(consultation.type)}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Редактировать</Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddReminder();
            }}
          >
            <Bell className="mr-2 h-4 w-4" />
            Добавить напоминание
          </Button>
        </div>
      </div>
      
      <div className="p-4 border rounded-md bg-muted/30">
        <h3 className="font-medium mb-2">Информация о клиенте</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">ФИО:</span>
            <span className="ml-2 font-medium">{consultation.clientName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Телефон:</span>
            <span className="ml-2 font-medium">{consultation.clientPhone}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Дата рождения:</span>
            <span className="ml-2 font-medium">
              {format(consultation.clientDob, "d MMMM yyyy", { locale: ru })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Дата и время</p>
          <p className="font-medium">
            {format(consultation.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Продолжительность</p>
          <p className="font-medium">{consultation.duration} минут</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Тип консультации</p>
          <p className="font-medium">{getConsultationTypeText(consultation.type)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Формат</p>
          <p className="font-medium">{getFormatText(consultation.format)}</p>
        </div>
      </div>
      
      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
        <p>{consultation.request}</p>
      </div>
      
      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-1">Заметки</p>
        <p>{consultation.notes || "Нет заметок"}</p>
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
              <Link to={`/analysis/${consultation.clientId}`}>
                <Eye className="h-4 w-4 mr-1" />
                Просмотр
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
