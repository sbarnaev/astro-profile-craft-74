
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Video, Users, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsultationType } from "@/types/consultations";

interface ConsultationListProps {
  consultations: any[];
  emptyMessage: React.ReactNode;
  onConsultationClick: (consultation: any) => void;
  onNewConsultation?: () => void;
}

export function ConsultationList({
  consultations,
  emptyMessage,
  onConsultationClick,
  onNewConsultation
}: ConsultationListProps) {
  // Utility functions
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "in-person":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
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

  if (consultations.length === 0) {
    return emptyMessage;
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <Card 
          key={consultation.id}
          className="cursor-pointer hover:border-primary transition-all"
          onClick={() => onConsultationClick(consultation)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">
                    {format(consultation.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
                  </span>
                  <Badge variant={getBadgeVariant(consultation.status)} className="ml-2">
                    {getStatusText(consultation.status)}
                  </Badge>
                </div>
                <h3 className="text-lg font-medium">{consultation.clientName}</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{consultation.duration} мин.</span>
                  </div>
                  <div className="flex items-center">
                    {getFormatIcon(consultation.format)}
                    <span className="ml-2 text-sm text-muted-foreground">{getFormatText(consultation.format)}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{consultation.request}</p>
                </div>
              </div>
              <Badge variant="outline" className="self-start whitespace-nowrap">
                {getConsultationTypeText(consultation.type)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Utility function for consultation type text
export const getConsultationTypeText = (type: string) => {
  switch (type) {
    case "express":
      return "Экспресс-консультация";
    case "basic":
      return "Базовая консультация";
    case "relationship":
      return "Консультация по отношениям";
    case "targeted":
      return "Целевая консультация";
    default:
      return "Консультация";
  }
};
