
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Calendar, 
  Eye, 
  Bell, 
  BookOpen, 
  Puzzle, 
  Stethoscope, 
  FileText, 
  MessageCircle, 
  Play, 
  Pause, 
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { getConsultationTypeText } from "./ConsultationList";
import { useToast } from "@/hooks/use-toast";

interface ConsultationDetailsProps {
  consultation: any;
  onAddReminder: () => void;
}

export function ConsultationDetails({ consultation, onAddReminder }: ConsultationDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [consultationStatus, setConsultationStatus] = useState<"idle" | "active" | "paused">("idle");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [notes, setNotes] = useState(consultation.notes || "");
  const { toast } = useToast();

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

  const startConsultation = () => {
    const now = new Date();
    setStartTime(now);
    setConsultationStatus("active");
    
    // Запускаем таймер
    const interval = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
    
    toast({
      title: "Консультация начата",
      description: `Начало: ${format(now, "HH:mm:ss")}`,
    });
  };

  const pauseConsultation = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setConsultationStatus("paused");
    
    toast({
      title: "Консультация приостановлена",
      description: `Прошло времени: ${formatElapsedTime(elapsedTime)}`,
    });
  };

  const resumeConsultation = () => {
    setConsultationStatus("active");
    
    const interval = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
    
    toast({
      title: "Консультация возобновлена",
    });
  };

  const endConsultation = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setConsultationStatus("idle");
    
    toast({
      title: "Консультация завершена",
      description: `Общее время: ${formatElapsedTime(elapsedTime)}`,
    });
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNotes = () => {
    // В будущем - сохранение заметок в базу данных
    toast({
      title: "Заметки сохранены",
    });
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <Badge variant={getBadgeVariant(consultation.status)} className="mb-2">
              {getStatusText(consultation.status)}
            </Badge>
            <h3 className="text-lg font-medium">{getConsultationTypeText(consultation.type)}</h3>
          </div>
          <div className="flex items-center gap-2">
            {consultationStatus === "idle" && (
              <Button onClick={startConsultation} className="bg-green-500 hover:bg-green-600">
                <Play className="mr-2 h-4 w-4" />
                Начать консультацию
              </Button>
            )}
            
            {consultationStatus === "active" && (
              <Button onClick={pauseConsultation} variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50">
                <Pause className="mr-2 h-4 w-4" />
                Пауза
              </Button>
            )}
            
            {consultationStatus === "paused" && (
              <Button onClick={resumeConsultation} className="bg-green-500 hover:bg-green-600">
                <Play className="mr-2 h-4 w-4" />
                Продолжить
              </Button>
            )}
            
            {(consultationStatus === "active" || consultationStatus === "paused") && (
              <Button onClick={endConsultation} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                <Square className="mr-2 h-4 w-4" />
                Завершить
              </Button>
            )}
            
            {startTime && (
              <div className="ml-2 px-3 py-1 bg-muted rounded-md">
                <span className="text-sm font-medium">{formatElapsedTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Информация о клиенте */}
      <div className="p-4 border rounded-md bg-muted/30 w-full">
        <h3 className="font-medium mb-2">Информация о клиенте</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">ФИО:</span>
            <span className="ml-2 font-medium">{consultation.clientName}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Телефон:</span>
            <span className="ml-2 font-medium">{consultation.clientPhone}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Дата рождения:</span>
            <span className="ml-2 font-medium">
              {format(consultation.clientDob, "d MMMM yyyy", { locale: ru })}
            </span>
          </div>
        </div>
      </div>
      
      {/* Запрос клиента */}
      <div className="p-4 border rounded-md w-full">
        <h3 className="font-medium mb-2">Запрос клиента</h3>
        <p>{consultation.request}</p>
      </div>
      
      {/* Формат консультации */}
      <div className="p-4 border rounded-md w-full">
        <h3 className="font-medium mb-2">Формат консультации</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-muted-foreground">Тип:</span>
            <span className="ml-2 font-medium">{getConsultationTypeText(consultation.type)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Формат:</span>
            <span className="ml-2 font-medium">{getFormatText(consultation.format)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Длительность:</span>
            <span className="ml-2 font-medium">{consultation.duration} минут</span>
          </div>
          <div>
            <span className="text-muted-foreground">Дата и время:</span>
            <span className="ml-2 font-medium">
              {format(consultation.date, "d MMMM yyyy 'в' HH:mm", { locale: ru })}
            </span>
          </div>
        </div>
      </div>
      
      {/* Коды и архетипы */}
      <div className="p-4 border rounded-md w-full">
        <h3 className="font-medium mb-2">Коды и архетипы</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-800">Личность: 3/5</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-800">Коннектор: 2/1</Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-800">Реализация: 4/6</Badge>
          <Badge variant="outline" className="bg-amber-50 text-amber-800">Генератор: 1/3</Badge>
          <Badge variant="outline" className="bg-rose-50 text-rose-800">Миссия: 5/2</Badge>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-800">Архетип: Творец</Badge>
          <Badge variant="outline" className="bg-cyan-50 text-cyan-800">Архетип: Мудрец</Badge>
        </div>
      </div>
      
      {/* Саммари анализа */}
      <div className="p-4 border rounded-md w-full">
        <h3 className="font-medium mb-2">Саммари анализа</h3>
        <p className="text-sm">
          Клиент с ярко выраженными творческими способностями и аналитическим мышлением. 
          Основные сильные стороны: креативность, внимание к деталям, стратегическое мышление. 
          Потенциальные вызовы: периодические сомнения в своих силах, трудности с принятием 
          решений в ситуациях с высокой неопределенностью.
        </p>
      </div>
      
      {/* Разделы с вкладками */}
      <div className="w-full border rounded-md overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex overflow-x-auto justify-start p-0 h-auto bg-transparent border-b">
            <TabsTrigger value="summary" className="flex-1 rounded-none border-r data-[state=active]:bg-muted">
              <FileText className="mr-2 h-4 w-4" />
              Расшифровка
            </TabsTrigger>
            <TabsTrigger value="atlas" className="flex-1 rounded-none border-r data-[state=active]:bg-muted">
              <BookOpen className="mr-2 h-4 w-4" />
              Атлас архетипов
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex-1 rounded-none border-r data-[state=active]:bg-muted">
              <Stethoscope className="mr-2 h-4 w-4" />
              Диагностика
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1 rounded-none border-r data-[state=active]:bg-muted">
              <Puzzle className="mr-2 h-4 w-4" />
              Готовый анализ
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex-1 rounded-none border-r data-[state=active]:bg-muted">
              <MessageCircle className="mr-2 h-4 w-4" />
              Помощник
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1 rounded-none data-[state=active]:bg-muted">
              <FileText className="mr-2 h-4 w-4" />
              Заметки
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="p-4">
            <h3 className="font-medium mb-2">Расшифровка кодов</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Личность: 3/5</h4>
                <p className="text-sm mt-1">
                  Творческий потенциал сочетается с логическим мышлением. Способность видеть как 
                  общую картину, так и детали. Выраженные коммуникативные навыки, умение убеждать.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Коннектор: 2/1</h4>
                <p className="text-sm mt-1">
                  Склонность к глубокой интроспекции и анализу собственных эмоций и чувств. 
                  Избирательность в выборе социальных контактов, предпочтение качества отношений их количеству.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Реализация: 4/6</h4>
                <p className="text-sm mt-1">
                  Методичность в достижении целей, последовательность действий. 
                  Умение структурировать и организовывать рабочий процесс. 
                  Ответственность и надежность.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Генератор: 1/3</h4>
                <p className="text-sm mt-1">
                  Способность генерировать новые идеи, смотреть на проблемы под нестандартным углом. 
                  Экспериментаторство и готовность пробовать новое.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Миссия: 5/2</h4>
                <p className="text-sm mt-1">
                  Стремление к свободе и независимости в профессиональной реализации. 
                  Желание помогать другим людям, делиться знаниями и опытом.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="atlas" className="p-4">
            <h3 className="font-medium mb-2">Атлас архетипов</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm">Архетип: Творец</h4>
                <p className="text-sm mt-1">
                  Ключевые характеристики: инновационность, творческий подход, стремление к самовыражению.
                  Потенциальные вызовы: перфекционизм, трудности с завершением проектов.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Архетип: Мудрец</h4>
                <p className="text-sm mt-1">
                  Ключевые характеристики: аналитический ум, поиск истины, стремление к знаниям.
                  Потенциальные вызовы: чрезмерный анализ, трудности с принятием решений из-за стремления собрать больше информации.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="diagnostics" className="p-4">
            <h3 className="font-medium mb-2">Диагностика</h3>
            <div className="space-y-2">
              <p className="text-sm">Зона комфорта: Интеллектуальная деятельность, творческие проекты, структурированная работа.</p>
              <p className="text-sm">Зона развития: Эмоциональный интеллект, принятие решений в условиях неопределенности.</p>
              <p className="text-sm">Потенциал роста: Высокий в областях, связанных с инновациями и обучением других.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="p-4">
            <h3 className="font-medium mb-2">Готовый анализ</h3>
            <div className="space-y-4">
              <p className="text-sm">
                Клиент обладает редким сочетанием творческого мышления и аналитических способностей. 
                Это позволяет не только генерировать оригинальные идеи, но и успешно доводить их до 
                практической реализации.
              </p>
              <p className="text-sm">
                В профессиональной сфере наиболее подходящими будут роли, связанные с созданием 
                новых концепций, обучением других, систематизацией знаний. Возможные направления: 
                консультирование, исследовательская деятельность, образование, творческие профессии.
              </p>
              <p className="text-sm">
                В отношениях ценит глубину и искренность, предпочитает качество контактов их количеству. 
                Важно создавать пространство для самовыражения и интеллектуального роста.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="assistant" className="p-4">
            <div className="text-center p-8">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium mt-4">ИИ-помощник консультаций</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Функция будет доступна в ближайшем обновлении. Здесь вы сможете общаться с ИИ-помощником
                во время консультации для получения подсказок и рекомендаций.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium mb-2">Заметки по консультации</h3>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Введите заметки по консультации..." 
                className="min-h-[200px]"
              />
              <Button onClick={handleSaveNotes}>Сохранить заметки</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="border-t border-border pt-4 flex justify-between">
        <Button variant="outline" onClick={onAddReminder}>
          <Bell className="mr-2 h-4 w-4" />
          Добавить напоминание
        </Button>
        
        <div>
          <Button variant="outline" className="mr-2">
            <Calendar className="mr-2 h-4 w-4" />
            Запланировать следующую
          </Button>
          
          <Button variant="outline" asChild>
            <Link to={`/analysis/${consultation.clientId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Просмотр анализа
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
