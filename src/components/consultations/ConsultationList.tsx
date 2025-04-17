
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
}: ConsultationListProps) {
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
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{consultation.clientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(consultation.date), "d MMMM yyyy", { locale: ru })}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {`${format(new Date(consultation.date), "HH:mm")} • ${consultation.duration} мин.`}
                </p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-md p-4">
                <h4 className="text-red-600 font-medium mb-2">Запрос клиента</h4>
                <p className="text-sm">{consultation.request}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Саммари о клиенте (из анализа)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline">Диагностика</Badge>
                  <Badge variant="outline">Возможности</Badge>
                  <Badge variant="outline">Конфликты</Badge>
                  <Badge variant="outline">Помощник</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <Badge variant="outline">Ассистент</Badge>
                  <Badge variant="outline">Коррекция</Badge>
                  <Badge variant="outline">Расшифровки</Badge>
                </div>
              </div>

              {consultation.notes && (
                <div className="border rounded-md p-4">
                  <p className="text-sm">{consultation.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
