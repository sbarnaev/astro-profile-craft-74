
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Video, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Пример данных о консультациях
const consultationsData = [
  { 
    id: 1,
    clientId: 1,
    date: new Date(2025, 3, 5, 14, 30),
    duration: 60,
    type: "video",
    status: "scheduled",
    notes: "Первичная консультация"
  },
  { 
    id: 2,
    clientId: 1,
    date: new Date(2025, 2, 20, 11, 0),
    duration: 90,
    type: "in-person",
    status: "completed",
    notes: "Обсуждение результатов анализа"
  },
  { 
    id: 3,
    clientId: 1,
    date: new Date(2025, 2, 1, 16, 0),
    duration: 60,
    type: "video",
    status: "completed",
    notes: "Разбор профиля и потенциала"
  },
  { 
    id: 4,
    clientId: 2,
    date: new Date(2025, 2, 15, 13, 0),
    duration: 60,
    type: "in-person",
    status: "completed",
    notes: "Первичная консультация"
  },
];

interface ClientConsultationsProps {
  clientId: number;
}

export const ClientConsultations = ({ clientId }: ClientConsultationsProps) => {
  // Фильтрация консультаций для текущего клиента
  const clientConsultations = consultationsData
    .filter(consultation => consultation.clientId === clientId)
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Сортировка по дате (сначала новые)
  
  const upcomingConsultations = clientConsultations.filter(
    consultation => consultation.status === "scheduled" && consultation.date > new Date()
  );
  
  const pastConsultations = clientConsultations.filter(
    consultation => consultation.status === "completed" || consultation.date <= new Date()
  );
  
  const formatConsultationDate = (date: Date) => {
    return format(date, "d MMMM yyyy 'в' HH:mm", { locale: ru });
  };
  
  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "in-person":
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getConsultationTypeText = (type: string) => {
    switch (type) {
      case "video":
        return "Видео-консультация";
      case "in-person":
        return "Очная встреча";
      default:
        return "Консультация";
    }
  };

  return (
    <div className="space-y-6">
      {upcomingConsultations.length > 0 && (
        <Card className="border-none">
          <CardHeader className="pb-2">
            <CardTitle>Предстоящие консультации</CardTitle>
            <CardDescription>
              Запланированные консультации с клиентом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <div key={consultation.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{formatConsultationDate(consultation.date)}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{consultation.duration} мин.</span>
                      </div>
                      <div className="flex items-center">
                        {getConsultationTypeIcon(consultation.type)}
                        <span className="ml-2 text-sm text-muted-foreground">{getConsultationTypeText(consultation.type)}</span>
                      </div>
                    </div>
                    {consultation.notes && (
                      <p className="text-sm">{consultation.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/consultations/${consultation.id}`}>
                        Подробнее
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {pastConsultations.length > 0 && (
        <Card className="border-none">
          <CardHeader className="pb-2">
            <CardTitle>История консультаций</CardTitle>
            <CardDescription>
              Прошедшие консультации с клиентом
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastConsultations.map((consultation) => (
                <div key={consultation.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{formatConsultationDate(consultation.date)}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{consultation.duration} мин.</span>
                      </div>
                      <div className="flex items-center">
                        {getConsultationTypeIcon(consultation.type)}
                        <span className="ml-2 text-sm text-muted-foreground">{getConsultationTypeText(consultation.type)}</span>
                      </div>
                    </div>
                    {consultation.notes && (
                      <p className="text-sm">{consultation.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/consultations/${consultation.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Записи
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {upcomingConsultations.length === 0 && pastConsultations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Нет консультаций</h3>
          <p className="text-muted-foreground mb-6">
            У этого клиента пока нет запланированных или прошедших консультаций
          </p>
          <Button asChild>
            <Link to={`/consultations/schedule?client=${clientId}`}>
              <Calendar className="mr-2 h-4 w-4" />
              Записать на консультацию
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
