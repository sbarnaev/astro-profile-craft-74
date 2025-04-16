
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Video, Users, FileText, MessageCircle, Eye, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Пример данных о консультациях
const consultationsData = [
  { 
    id: 1,
    clientId: 1,
    date: new Date(2025, 3, 5, 14, 30),
    duration: 60,
    type: "video",
    status: "scheduled",
    notes: "Первичная консультация",
    request: "Хочу разобраться с проблемами в личной жизни",
    cost: 3500
  },
  { 
    id: 2,
    clientId: 1,
    date: new Date(2025, 2, 20, 11, 0),
    duration: 90,
    type: "in-person",
    status: "completed",
    notes: "Обсуждение результатов анализа",
    request: "Нужна помощь в понимании направления развития карьеры",
    cost: 5000
  },
  { 
    id: 3,
    clientId: 1,
    date: new Date(2025, 2, 1, 16, 0),
    duration: 60,
    type: "video",
    status: "completed",
    notes: "Разбор профиля и потенциала",
    request: "Хочу понять свое предназначение и таланты",
    cost: 3500
  },
  { 
    id: 4,
    clientId: 2,
    date: new Date(2025, 2, 15, 13, 0),
    duration: 60,
    type: "in-person",
    status: "completed",
    notes: "Первичная консультация",
    request: "Проблемы в отношениях с родителями",
    cost: 3500
  },
];

interface ClientConsultationsProps {
  clientId: string;
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
                <Drawer key={consultation.id}>
                  <DrawerTrigger asChild>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">{formatConsultationDate(consultation.date)}</span>
                          <Badge variant={getBadgeVariant(consultation.status)} className="ml-2">
                            {getStatusText(consultation.status)}
                          </Badge>
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
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{consultation.cost.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{consultation.request}</p>
                        </div>
                        {consultation.notes && (
                          <p className="text-sm text-muted-foreground">Заметки: {consultation.notes}</p>
                        )}
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Детали консультации</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Badge variant={getBadgeVariant(consultation.status)} className="mb-2">
                            {getStatusText(consultation.status)}
                          </Badge>
                          <h3 className="text-lg font-medium">{getConsultationTypeText(consultation.type)}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/consultations?id=${consultation.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Просмотр
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">Редактировать</Button>
                          <Button variant="destructive" size="sm">Отменить</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Дата и время</p>
                          <p className="font-medium">
                            {formatConsultationDate(consultation.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Продолжительность</p>
                          <p className="font-medium">{consultation.duration} минут</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-border pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Стоимость</p>
                          <p className="font-medium text-lg text-green-600">{consultation.cost.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/consultations?id=${consultation.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Открыть полную информацию
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
                        <p>{consultation.request}</p>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Заметки</p>
                        <p>{consultation.notes || "Нет заметок"}</p>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
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
                <Drawer key={consultation.id}>
                  <DrawerTrigger asChild>
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">{formatConsultationDate(consultation.date)}</span>
                          <Badge variant={getBadgeVariant(consultation.status)} className="ml-2">
                            {getStatusText(consultation.status)}
                          </Badge>
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
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{consultation.cost.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{consultation.request}</p>
                        </div>
                        {consultation.notes && (
                          <p className="text-sm text-muted-foreground">Заметки: {consultation.notes}</p>
                        )}
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Детали консультации</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Badge variant={getBadgeVariant(consultation.status)} className="mb-2">
                            {getStatusText(consultation.status)}
                          </Badge>
                          <h3 className="text-lg font-medium">{getConsultationTypeText(consultation.type)}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/consultations?id=${consultation.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Просмотр
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Дата и время</p>
                          <p className="font-medium">
                            {formatConsultationDate(consultation.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Продолжительность</p>
                          <p className="font-medium">{consultation.duration} минут</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-t border-border pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Стоимость</p>
                          <p className="font-medium text-lg text-green-600">{consultation.cost.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/consultations?id=${consultation.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Открыть полную информацию
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
                        <p>{consultation.request}</p>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-1">Заметки</p>
                        <p>{consultation.notes || "Нет заметок"}</p>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
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
