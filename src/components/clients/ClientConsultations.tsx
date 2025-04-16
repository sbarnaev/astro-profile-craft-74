
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Video, Users, FileText, MessageCircle, Eye, DollarSign, Edit, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";

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
    cost: 3500,
    results: "Выявлены основные проблемные зоны в отношениях. Составлен план работы."
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
    cost: 5000,
    results: "Проведен полный анализ карьерных перспектив. Определены 3 основных направления для развития."
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
    cost: 3500,
    results: "Определены основные таланты и предрасположенности. Сформулирована сфера потенциальной самореализации."
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
    cost: 3500,
    results: null
  },
];

interface ClientConsultationsProps {
  clientId: number;
}

export const ClientConsultations = ({ clientId }: ClientConsultationsProps) => {
  const [consultations, setConsultations] = useState(consultationsData);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Редактирование консультации
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editDuration, setEditDuration] = useState<number>(0);
  const [editCost, setEditCost] = useState<number>(0);
  const [editRequest, setEditRequest] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editResults, setEditResults] = useState<string>("");
  
  // Фильтрация консультаций для текущего клиента
  const clientConsultations = consultations
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

  const handleOpenConsultationDetails = (consultation: any) => {
    setSelectedConsultation(consultation);
    setIsConsultationDetailsOpen(true);
  };

  const handleCloseConsultationDetails = () => {
    setSelectedConsultation(null);
    setIsConsultationDetailsOpen(false);
  };

  const handleOpenEditDialog = () => {
    if (selectedConsultation) {
      const consultation = selectedConsultation;
      setEditDate(format(consultation.date, "yyyy-MM-dd"));
      setEditTime(format(consultation.date, "HH:mm"));
      setEditDuration(consultation.duration);
      setEditCost(consultation.cost);
      setEditRequest(consultation.request);
      setEditNotes(consultation.notes || "");
      setEditResults(consultation.results || "");
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveConsultation = () => {
    if (!selectedConsultation) return;
    
    // Parse the date and time
    const [year, month, day] = editDate.split('-').map(Number);
    const [hours, minutes] = editTime.split(':').map(Number);
    const newDate = new Date(year, month - 1, day, hours, minutes);
    
    // Update the consultation
    const updatedConsultations = consultations.map(c => 
      c.id === selectedConsultation.id 
        ? {
            ...c,
            date: newDate,
            duration: editDuration,
            cost: editCost,
            request: editRequest,
            notes: editNotes,
            results: editResults
          }
        : c
    );
    
    setConsultations(updatedConsultations);
    
    // Update the selected consultation
    const updatedConsultation = {
      ...selectedConsultation,
      date: newDate,
      duration: editDuration,
      cost: editCost,
      request: editRequest,
      notes: editNotes,
      results: editResults
    };
    
    setSelectedConsultation(updatedConsultation);
    setIsEditDialogOpen(false);
    
    toast.success("Консультация обновлена", {
      description: "Изменения успешно сохранены"
    });
  };

  // Карточка детальной информации о консультации
  const ConsultationCard = () => {
    if (!selectedConsultation) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleCloseConsultationDetails} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-medium">Детали консультации</h3>
          </div>
          <Button onClick={handleOpenEditDialog}>
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Информация о консультации</CardTitle>
            <Badge variant={getBadgeVariant(selectedConsultation.status)} className="mt-2">
              {getStatusText(selectedConsultation.status)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Дата и время</h4>
                <p className="font-medium">{formatConsultationDate(selectedConsultation.date)}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Тип консультации</h4>
                <div className="flex items-center">
                  {getConsultationTypeIcon(selectedConsultation.type)}
                  <span className="ml-2">{getConsultationTypeText(selectedConsultation.type)}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Продолжительность</h4>
                <p>{selectedConsultation.duration} минут</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Стоимость</h4>
                <p className="font-medium text-green-600">{selectedConsultation.cost.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Запрос клиента</h4>
              <p>{selectedConsultation.request}</p>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Заметки</h4>
              <p>{selectedConsultation.notes || "Нет заметок"}</p>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Результаты консультации</h4>
              <p>{selectedConsultation.results || "Результаты не заполнены"}</p>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Редактирование консультации</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Дата</Label>
                  <Input 
                    id="edit-date" 
                    type="date" 
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Время</Label>
                  <Input 
                    id="edit-time" 
                    type="time" 
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Продолжительность (минуты)</Label>
                  <Input 
                    id="edit-duration" 
                    type="number" 
                    value={editDuration}
                    onChange={(e) => setEditDuration(parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Стоимость (₽)</Label>
                  <Input 
                    id="edit-cost" 
                    type="number" 
                    value={editCost}
                    onChange={(e) => setEditCost(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-request">Запрос клиента</Label>
                <Textarea 
                  id="edit-request" 
                  value={editRequest}
                  onChange={(e) => setEditRequest(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Заметки</Label>
                <Textarea 
                  id="edit-notes" 
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-results">Результаты консультации</Label>
                <Textarea 
                  id="edit-results" 
                  value={editResults}
                  onChange={(e) => setEditResults(e.target.value)}
                  rows={3}
                  placeholder="Опишите результаты проведенной консультации"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="button" onClick={handleSaveConsultation}>
                  Сохранить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Если открыта детальная карточка консультации
  if (isConsultationDetailsOpen && selectedConsultation) {
    return <ConsultationCard />;
  }

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
                <div key={consultation.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => handleOpenConsultationDetails(consultation)}>
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenConsultationDetails(consultation);
                    }}
                    className="mt-4 md:mt-0"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Открыть
                  </Button>
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
                <div key={consultation.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => handleOpenConsultationDetails(consultation)}>
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenConsultationDetails(consultation);
                    }}
                    className="mt-4 md:mt-0"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Открыть
                  </Button>
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
