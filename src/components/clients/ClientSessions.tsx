
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { PlusCircle, Calendar, Video, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationList, getConsultationTypeText } from "@/components/consultations/ConsultationList";

// Временные данные для сессий клиента
const sessionsData = [
  { 
    id: 1,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 3, 10, 14, 0), // 10 апреля 2025, 14:00
    duration: 60,
    type: "basic",
    format: "video",
    status: "scheduled",
    request: "Обсуждение результатов анализа личности"
  },
  { 
    id: 2,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 2, 15, 15, 30), // 15 марта 2025, 15:30
    duration: 45,
    type: "express",
    format: "in-person",
    status: "completed",
    request: "Экспресс-консультация по вопросам карьеры"
  },
  { 
    id: 3,
    clientId: 2,
    clientName: "Петрова Анна",
    clientPhone: "+7 (900) 987-65-43",
    clientDob: new Date(1985, 8, 20),
    date: new Date(2025, 3, 12, 10, 0), // 12 апреля 2025, 10:00
    duration: 90,
    type: "relationship",
    format: "video",
    status: "scheduled",
    request: "Консультация по вопросам отношений"
  }
];

interface ClientSessionsProps {
  clientId: number;
}

export const ClientSessions = ({ clientId }: ClientSessionsProps) => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const navigate = useNavigate();
  
  // Фильтрация сессий для текущего клиента и сортировка по дате
  const clientSessions = sessionsData
    .filter(session => session.clientId === clientId)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const upcomingSessions = clientSessions
    .filter(session => session.status === "scheduled" && session.date >= new Date());
  
  const pastSessions = clientSessions
    .filter(session => session.status === "completed" || session.date < new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const handleScheduleSession = () => {
    // Create a custom event to handle session scheduling
    const event = new CustomEvent('openSessionDialog', {
      detail: { clientId }
    });
    document.dispatchEvent(event);
  };
  
  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    navigate(`/sessions?id=${session.id}`);
  };
  
  useEffect(() => {
    const handleOpenSessionDialog = (event: CustomEvent) => {
      const clientId = event.detail?.clientId;
      if (clientId) {
        navigate(`/sessions/schedule?client=${clientId}`);
      }
    };
    
    document.addEventListener('openSessionDialog', handleOpenSessionDialog as EventListener);
    
    return () => {
      document.removeEventListener('openSessionDialog', handleOpenSessionDialog as EventListener);
    };
  }, [navigate]);
  
  const EmptySessionsState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Нет запланированных сессий</h3>
      <p className="text-muted-foreground mb-6">
        У этого клиента пока нет запланированных сессий
      </p>
      <Button onClick={handleScheduleSession}>
        <Calendar className="mr-2 h-4 w-4" />
        Записать на сессию
      </Button>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Сессии клиента</h3>
        <Button size="sm" onClick={handleScheduleSession}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Записать на сессию
        </Button>
      </div>
      
      {upcomingSessions.length > 0 && (
        <Card className="border-none">
          <CardHeader className="pb-2">
            <CardTitle>Предстоящие сессии</CardTitle>
            <CardDescription>
              Запланированные сессии с клиентом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConsultationList 
              consultations={upcomingSessions}
              emptyMessage={<EmptySessionsState />}
              onConsultationClick={handleSessionClick}
            />
          </CardContent>
        </Card>
      )}
      
      {pastSessions.length > 0 && (
        <Card className="border-none">
          <CardHeader className="pb-2">
            <CardTitle>Прошедшие сессии</CardTitle>
            <CardDescription>
              История сессий с клиентом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConsultationList 
              consultations={pastSessions}
              emptyMessage={<></>}
              onConsultationClick={handleSessionClick}
            />
          </CardContent>
        </Card>
      )}
      
      {clientSessions.length === 0 && <EmptySessionsState />}
    </div>
  );
};
