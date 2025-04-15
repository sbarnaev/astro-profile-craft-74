
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Search, Plus, Calendar, Video, Users, Clock, MessageCircle, Eye, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ClientSearch } from "@/components/analysis/ClientSearch";
import { ClientForm } from "@/components/clients/ClientForm";
import { ConsultationForm } from "@/components/consultations/ConsultationForm";
import { ReminderForm } from "@/components/consultations/ReminderForm";

// Пример данных о консультациях
const consultationsData = [
  { 
    id: 1,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 3, 5, 14, 30),
    duration: 60,
    type: "basic",
    format: "video",
    status: "scheduled",
    notes: "Первичная консультация",
    request: "Хочу разобраться с проблемами в личной жизни"
  },
  { 
    id: 2,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 2, 20, 11, 0),
    duration: 90,
    type: "relationship",
    format: "in-person",
    status: "completed",
    notes: "Обсуждение результатов анализа",
    request: "Нужна помощь в понимании направления развития карьеры"
  },
  { 
    id: 3,
    clientId: 2,
    clientName: "Петрова Анна",
    clientPhone: "+7 (900) 987-65-43",
    clientDob: new Date(1985, 8, 20),
    date: new Date(2025, 2, 1, 16, 0),
    duration: 60,
    type: "express",
    format: "video",
    status: "completed",
    notes: "Разбор профиля и потенциала",
    request: "Хочу понять свое предназначение и таланты"
  },
];

export default function Consultations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  
  // Фильтрация консультаций
  const filteredConsultations = consultationsData.filter(consultation => {
    const query = searchQuery.toLowerCase();
    return (
      consultation.clientName.toLowerCase().includes(query) ||
      consultation.clientPhone.includes(query) ||
      consultation.request.toLowerCase().includes(query) ||
      format(consultation.date, "dd.MM.yyyy").includes(query)
    );
  });
  
  const upcomingConsultations = filteredConsultations.filter(
    consultation => consultation.status === "scheduled" && consultation.date > new Date()
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const pastConsultations = filteredConsultations.filter(
    consultation => consultation.status === "completed" || consultation.date <= new Date()
  ).sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const handleClientSelect = (client: any) => {
    setIsClientSearchOpen(false);
    setSelectedClient(client);
    setIsConsultationFormOpen(true);
  };
  
  const handleCreateClient = (data: any) => {
    setIsClientFormOpen(false);
    // После создания клиента, открываем форму консультации с новым клиентом
    setSelectedClient({
      id: Date.now(), // Временный ID
      firstName: data.firstName,
      lastName: data.lastName,
      patronymic: data.patronymic,
      dob: data.dob,
      phone: data.phone,
      email: data.email
    });
    setIsConsultationFormOpen(true);
  };
  
  const handleCreateConsultation = (data: any) => {
    setIsConsultationFormOpen(false);
    console.log("Created consultation:", { ...data, client: selectedClient });
    setSelectedClient(null);
  };
  
  const handleCreateReminder = (data: any) => {
    setIsReminderFormOpen(false);
    console.log("Created reminder for consultation:", data);
  };
  
  const getConsultationTypeText = (type: string) => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Консультации</h1>
        <Button onClick={() => setIsClientSearchOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Записать на консультацию
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск по клиенту, запросу или дате..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upcoming" className="text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Предстоящие
          </TabsTrigger>
          <TabsTrigger value="past" className="text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Прошедшие
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingConsultations.length > 0 ? (
            upcomingConsultations.map((consultation) => (
              <Card 
                key={consultation.id}
                className="cursor-pointer hover:border-primary transition-all"
                onClick={() => {
                  setSelectedConsultation(consultation);
                  setIsConsultationDetailsOpen(true);
                }}
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет предстоящих консультаций</h3>
              <p className="text-muted-foreground mb-6">
                У вас пока нет запланированных консультаций
              </p>
              <Button onClick={() => setIsClientSearchOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Записать на консультацию
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastConsultations.length > 0 ? (
            pastConsultations.map((consultation) => (
              <Card 
                key={consultation.id}
                className="cursor-pointer hover:border-primary transition-all"
                onClick={() => {
                  setSelectedConsultation(consultation);
                  setIsConsultationDetailsOpen(true);
                }}
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет прошедших консультаций</h3>
              <p className="text-muted-foreground mb-6">
                У вас пока нет проведенных консультаций
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Диалог детальной информации о консультации */}
      <Dialog open={isConsultationDetailsOpen} onOpenChange={setIsConsultationDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали консультации</DialogTitle>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant={getBadgeVariant(selectedConsultation.status)} className="mb-2">
                    {getStatusText(selectedConsultation.status)}
                  </Badge>
                  <h3 className="text-lg font-medium">{getConsultationTypeText(selectedConsultation.type)}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Редактировать</Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsReminderFormOpen(true);
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
                    <span className="ml-2 font-medium">{selectedConsultation.clientName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Телефон:</span>
                    <span className="ml-2 font-medium">{selectedConsultation.clientPhone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Дата рождения:</span>
                    <span className="ml-2 font-medium">
                      {format(selectedConsultation.clientDob, "d MMMM yyyy", { locale: ru })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Дата и время</p>
                  <p className="font-medium">
                    {format(selectedConsultation.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Продолжительность</p>
                  <p className="font-medium">{selectedConsultation.duration} минут</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Тип консультации</p>
                  <p className="font-medium">{getConsultationTypeText(selectedConsultation.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Формат</p>
                  <p className="font-medium">{getFormatText(selectedConsultation.format)}</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
                <p>{selectedConsultation.request}</p>
              </div>
              
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-1">Заметки</p>
                <p>{selectedConsultation.notes || "Нет заметок"}</p>
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
                      <Link to={`/analysis/${selectedConsultation.clientId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Просмотр
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Диалог поиска клиента */}
      <ClientSearch 
        isOpen={isClientSearchOpen} 
        onClose={() => setIsClientSearchOpen(false)}
        onSelect={handleClientSelect}
        onCreateNew={() => {
          setIsClientSearchOpen(false);
          setIsClientFormOpen(true);
        }}
      />
      
      {/* Диалог создания клиента */}
      <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создание нового клиента</DialogTitle>
          </DialogHeader>
          <ClientForm 
            onSubmit={handleCreateClient}
            showCodes={false}
          />
        </DialogContent>
      </Dialog>
      
      {/* Диалог создания консультации */}
      <Dialog open={isConsultationFormOpen} onOpenChange={setIsConsultationFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Запись на консультацию</DialogTitle>
          </DialogHeader>
          <ConsultationForm 
            client={selectedClient}
            onSubmit={handleCreateConsultation}
          />
        </DialogContent>
      </Dialog>
      
      {/* Диалог создания напоминания */}
      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание напоминания</DialogTitle>
          </DialogHeader>
          {selectedConsultation && (
            <ReminderForm 
              consultationId={selectedConsultation.id}
              onSubmit={handleCreateReminder}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
