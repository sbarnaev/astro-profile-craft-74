
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useConsultations } from "@/hooks/useConsultations";

interface ClientSessionsProps {
  clientId: string | number;
}

export const ClientSessions = ({ clientId }: ClientSessionsProps) => {
  const { consultations, loading } = useConsultations();
  const navigate = useNavigate();
  
  // Преобразуем clientId в строку для правильного сравнения
  const clientIdString = typeof clientId === 'string' ? clientId : String(clientId);
  
  // Фильтрация консультаций для данного клиента
  const clientConsultations = consultations.filter(
    (consultation) => consultation.clientId === clientIdString || String(consultation.clientId) === clientIdString
  );
  
  // Сортировка по дате (сначала последние)
  const sortedConsultations = [...clientConsultations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleScheduleSession = () => {
    // Переход на страницу календаря с указанием клиента
    navigate(`/calendar?view=week&client=${clientIdString}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Сессии</h3>
        <Button size="sm" onClick={handleScheduleSession}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Записать на сессию
        </Button>
      </div>
      
      {sortedConsultations.length > 0 ? (
        <div className="space-y-4">
          {sortedConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/consultations/${consultation.id}`)}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">
                    {consultation.type}
                    {consultation.status === "completed" && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Завершена)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(consultation.date), "d MMMM yyyy", {
                      locale: ru,
                    })}{" "}
                    • {consultation.time}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {consultation.duration} мин.
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg border-dashed">
          <p className="text-gray-500 mb-4">У клиента пока нет сессий</p>
          <Button size="sm" onClick={handleScheduleSession}>
            Записать на сессию
          </Button>
        </div>
      )}
    </div>
  );
};
