import { useState } from "react";
import { Calendar, FileText, Bell, Share2, MessageCircle, User, Upload, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

interface ClientInfoCardProps {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    dob: Date;
    phone: string;
    email?: string;
    source: string;
    communicationChannel: string;
    personalityCode: number | null;
    connectorCode: number | null;
    realizationCode: number | null;
    generatorCode: number | null;
    missionCode: string | number | null;
    revenue: number;
    avatar: string | null;
    hasAnalysis: boolean;
    analysisId?: string | null;
  };
  setOpenReminderDialog: (open: boolean) => void;
}

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

const getArchetypeName = (code: number | string | null): string => {
  if (code === null) return "Не определен";
  
  const archetypes: Record<string, string> = {
    "1": "Воин",
    "2": "Партнер",
    "3": "Творец",
    "4": "Исследователь",
    "5": "Путешественник",
    "6": "Учитель",
    "7": "Мудрец",
    "8": "Правитель",
    "9": "Философ",
    "10": "Дипломат",
    "11": "Целитель"
  };
  const codeStr = String(code);
  return archetypes[codeStr] || "Неизвестный";
};

export const ClientInfoCard = ({ client, setOpenReminderDialog }: ClientInfoCardProps) => {
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fullName = `${client.lastName} ${client.firstName} ${client.patronymic || ""}`.trim();
  const formattedDate = new Intl.DateTimeFormat('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(client.dob);

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
  
  return (
    <Card className="border-none">
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
              <Link to={`/analysis/new?client=${client.id}`}>
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
  );
};
