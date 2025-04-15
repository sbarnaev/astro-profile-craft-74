import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Calendar, FileText, Bell, Clock, User, Edit, ChevronLeft, MessageCircle, Share2, Info, Eye, Upload, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientConsultations } from "@/components/clients/ClientConsultations";
import { ClientReminders } from "@/components/clients/ClientReminders";
import { ClientAnalysis } from "@/components/clients/ClientAnalysis";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const clientsData = [
  { 
    id: 1, 
    firstName: "Анна", 
    lastName: "Смирнова", 
    patronymic: "Владимировна",
    dob: new Date(1993, 3, 14), 
    phone: "+7 (900) 123-45-67", 
    email: "anna@example.com",
    analysisCount: 3, 
    lastAnalysis: "02.03.2025",
    source: "instagram",
    communicationChannel: "whatsapp",
    personalityCode: 7,
    connectorCode: 5,
    realizationCode: 4,
    generatorCode: 3,
    missionCode: 11,
    hasAnalysis: true,
    analysisId: 123,
    revenue: 25000,
    avatar: null
  },
  { 
    id: 2, 
    firstName: "Иван", 
    lastName: "Петров", 
    patronymic: "Сергеевич",
    dob: new Date(1985, 1, 28), 
    phone: "+7 (911) 987-65-43", 
    email: "ivan@example.com",
    analysisCount: 2, 
    lastAnalysis: "15.02.2025",
    source: "referral",
    communicationChannel: "telegram",
    personalityCode: 9,
    connectorCode: 6,
    realizationCode: 8,
    generatorCode: 3,
    missionCode: 6,
    hasAnalysis: false,
    revenue: 15000,
    avatar: null
  },
];

const getSourceLabel = (source: string): string => {
  const sourceMap: Record<string, string> = {
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'vk': 'ВКонтакте',
    'referral': 'Рекомендация',
    'search': 'Поиск в интернете',
    'other': 'Другое'
  };
  return sourceMap[source] || source;
};

const getCommunicationLabel = (channel: string): string => {
  const channelMap: Record<string, string> = {
    'whatsapp': 'WhatsApp',
    'telegram': 'Telegram',
    'viber': 'Viber',
    'vk': 'ВКонтакте',
    'offline': 'Офлайн',
    'other': 'Другое'
  };
  return channelMap[channel] || channel;
};

const getCommunicationIcon = (channel: string) => {
  switch (channel.toLowerCase()) {
    case 'whatsapp':
      return <span className="text-green-500"><MessageCircle className="h-4 w-4" /></span>;
    case 'telegram':
      return <span className="text-blue-500"><MessageCircle className="h-4 w-4" /></span>;
    case 'viber':
      return <span className="text-purple-500"><MessageCircle className="h-4 w-4" /></span>;
    case 'vk':
      return <span className="text-blue-600"><MessageCircle className="h-4 w-4" /></span>;
    case 'offline':
      return <span className="text-gray-500"><User className="h-4 w-4" /></span>;
    default:
      return <span className="text-gray-500"><MessageCircle className="h-4 w-4" /></span>;
  }
};

const getArchetypeName = (code: number): string => {
  const archetypes: Record<number, string> = {
    1: "Воин",
    2: "Партнер",
    3: "Творец",
    4: "Исследователь",
    5: "Путешественник",
    6: "Учитель",
    7: "Мудрец",
    8: "Правитель",
    9: "Философ",
    10: "Дипломат",
    11: "Целитель"
  };
  return archetypes[code] || "Неизвестный";
};

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("consultations");
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  
  const client = clientsData.find(c => c.id === Number(id));
  
  useEffect(() => {
    if (location.state?.openReminder) {
      setActiveTab("reminders");
      setOpenReminderDialog(true);
    }
  }, [location.state]);
  
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Клиент не найден</h1>
        <p className="text-muted-foreground mb-8">Клиент с указанным ID не существует</p>
        <Button asChild>
          <Link to="/clients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к списку клиентов
          </Link>
        </Button>
      </div>
    );
  }
  
  const handleEditClient = (data: any) => {
    setOpen(false);
    toast.success("Данные клиента обновлены", {
      description: "Информация о клиенте была успешно обновлена."
    });
    console.log("Updated client data:", data);
  };
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveAvatar = () => {
    toast.success("Аватар клиента обновлен", {
      description: "Изображение профиля было успешно обновлено."
    });
    setAvatarUploadOpen(false);
  };
  
  const fullName = `${client.lastName} ${client.firstName} ${client.patronymic || ""}`.trim();
  const formattedDate = new Intl.DateTimeFormat('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(client.dob);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/clients">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Профиль клиента</h1>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать данные клиента</DialogTitle>
              </DialogHeader>
              <ClientForm 
                onSubmit={handleEditClient} 
                initialData={{ 
                  firstName: client.firstName,
                  lastName: client.lastName,
                  patronymic: client.patronymic || "",
                  dob: client.dob,
                  phone: client.phone,
                  email: client.email || "",
                  source: client.source,
                  communicationChannel: client.communicationChannel,
                  personalityCode: client.personalityCode,
                  connectorCode: client.connectorCode,
                  realizationCode: client.realizationCode,
                  generatorCode: client.generatorCode,
                  missionCode: client.missionCode
                }}
                generateAnalysis={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-none">
          <CardHeader className="pb-2">
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <Dialog open={avatarUploadOpen} onOpenChange={setAvatarUploadOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Avatar className="w-24 h-24">
                      {avatarPreview || client.avatar ? (
                        <AvatarImage src={avatarPreview || client.avatar} alt={fullName} />
                      ) : (
                        <AvatarFallback className="text-3xl font-medium bg-primary/10 text-primary">
                          {client.firstName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Загрузить аватар</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Avatar className="w-32 h-32">
                        {avatarPreview ? (
                          <AvatarImage src={avatarPreview} alt={fullName} />
                        ) : (
                          <AvatarFallback className="text-4xl font-medium bg-primary/10 text-primary">
                            {client.firstName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="avatar-upload" className="block text-sm font-medium text-gray-700">
                        Выберите изображение
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setAvatarUploadOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleSaveAvatar}>
                        Сохранить
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">ФИО</p>
              <p className="font-medium">{fullName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Дата рождения</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Телефон</p>
              <p className="font-medium">{client.phone}</p>
            </div>
            
            {client.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground">Источник</p>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{getSourceLabel(client.source)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Канал общения</p>
              <div className="flex items-center gap-1">
                {getCommunicationIcon(client.communicationChannel)}
                <p className="font-medium">{getCommunicationLabel(client.communicationChannel)}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-muted-foreground mb-2">Коды</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{client.personalityCode}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Личность</p>
                    <p className="text-sm font-medium">{client.personalityCode} | {getArchetypeName(client.personalityCode)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{client.connectorCode}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Коннектор</p>
                    <p className="text-sm font-medium">{client.connectorCode} | {getArchetypeName(client.connectorCode)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{client.realizationCode}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Реализация</p>
                    <p className="text-sm font-medium">{client.realizationCode} | {getArchetypeName(client.realizationCode)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{client.generatorCode}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Генератор</p>
                    <p className="text-sm font-medium">{client.generatorCode} | {getArchetypeName(client.generatorCode)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{client.missionCode}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Миссия</p>
                    <p className="text-sm font-medium">{client.missionCode} | {getArchetypeName(client.missionCode)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="text-green-600 h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Доход от клиента</p>
                  <p className="text-xl font-bold text-green-600">{client.revenue.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              {client.hasAnalysis ? (
                <Button className="w-full" asChild>
                  <Link to={`/analysis/${client.analysisId}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Анализ
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link to={`/analysis/${client.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Создать анализ
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/consultations/schedule?client=${client.id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Записать на консультацию
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setOpenReminderDialog(true)}
              >
                <Bell className="mr-2 h-4 w-4" />
                Создать напоминание
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consultations">
                <Calendar className="mr-2 h-4 w-4" />
                Консультации
              </TabsTrigger>
              <TabsTrigger value="reminders">
                <Bell className="mr-2 h-4 w-4" />
                Напоминания
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <FileText className="mr-2 h-4 w-4" />
                Анализы
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="consultations">
              <ClientConsultations clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="reminders">
              <ClientReminders clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="analysis">
              <ClientAnalysis clientId={client.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={openReminderDialog} onOpenChange={setOpenReminderDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Создать напоминание</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* Компонент формы напоминания */}
            {/* ...код формы напоминания... */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientProfile;
