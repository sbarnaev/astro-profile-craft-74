
import { useState, useEffect } from "react";
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
  Square,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { getConsultationTypeText } from "./ConsultationList";
import { useToast } from "@/hooks/use-toast";
import { useEffect as useEffectReal } from "react";

interface ConsultationDetailsProps {
  consultation: any;
  onAddReminder: () => void;
  onClose: () => void;
}

export function ConsultationDetails({ consultation, onAddReminder, onClose }: ConsultationDetailsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [consultationStatus, setConsultationStatus] = useState<"idle" | "active" | "paused">("idle");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [notes, setNotes] = useState(consultation.notes || "");
  const { toast } = useToast();
  
  // Автоматически сохраняем заметки при изменении
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (notes !== consultation.notes) {
        handleSaveNotes();
      }
    }, 1000);
    
    return () => clearTimeout(saveTimeout);
  }, [notes]);
  
  // Останавливаем консультацию при закрытии окна
  useEffect(() => {
    return () => {
      if (consultationStatus === "active" && timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [consultationStatus, timerInterval]);

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

  // Функция для планирования следующей консультации
  const handleScheduleNext = () => {
    // В будущем здесь будет логика открытия формы создания консультации с предзаполненными данными
    toast({
      title: "Функция планирования следующей консультации",
      description: "Открытие формы с предзаполненными данными клиента",
    });
  };

  // Функция для получения текста архетипа по коду
  const getArchetypeByCode = (code: number | string) => {
    const archetypes: Record<string, string> = {
      "1": "Лидер",
      "2": "Партнер",
      "3": "Творец",
      "4": "Стабилизатор",
      "5": "Путешественник",
      "6": "Гармонизатор",
      "7": "Мыслитель",
      "8": "Организатор",
      "9": "Мудрец",
      "11": "Учитель"
    };
    
    return archetypes[code.toString()] || "Неизвестно";
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="sticky top-0 z-10 bg-background pt-2 pb-4 border-b flex justify-between items-center">
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
            
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Информация о клиенте */}
        <div className="p-4 border rounded-md bg-muted/30 w-full my-4">
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
        <div className="p-4 border rounded-md w-full my-4">
          <h3 className="font-medium mb-2">Запрос клиента</h3>
          <p>{consultation.request}</p>
        </div>
        
        {/* Формат консультации */}
        <div className="p-4 border rounded-md w-full my-4">
          <h3 className="font-medium mb-2">Формат консультации</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Тип:</span>
              <span className="ml-2 font-medium">{getConsultationTypeText(consultation.type)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Длительность:</span>
              <span className="ml-2 font-medium">{consultation.duration} минут</span>
            </div>
          </div>
        </div>
        
        {/* Коды и архетипы */}
        <div className="p-4 border rounded-md w-full my-4">
          <h3 className="font-medium mb-2">Коды и архетипы</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-800">
              Личность: 3 | {getArchetypeByCode(3)}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800">
              Коннектор: 5 | {getArchetypeByCode(5)}
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-800">
              Реализация: 2 | {getArchetypeByCode(2)}
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-800">
              Генератор: 1 | {getArchetypeByCode(1)}
            </Badge>
            <Badge variant="outline" className="bg-rose-50 text-rose-800">
              Миссия: 5 | {getArchetypeByCode(5)}
            </Badge>
          </div>
        </div>
        
        {/* Саммари анализа */}
        <div className="p-4 border rounded-md w-full my-4">
          <h3 className="font-medium mb-2">Саммари анализа</h3>
          <p className="text-sm">
            Клиент с ярко выраженными творческими способностями и аналитическим мышлением. 
            Основные сильные стороны: креативность, внимание к деталям, стратегическое мышление. 
            Потенциальные вызовы: периодические сомнения в своих силах, трудности с принятием 
            решений в ситуациях с высокой неопределенностью.
          </p>
        </div>
        
        {/* Разделы с вкладками */}
        <div className="w-full border rounded-md overflow-hidden my-4">
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
                  <h4 className="font-medium text-sm">Личность: 3 | {getArchetypeByCode(3)}</h4>
                  <p className="text-sm mt-1">
                    Творческий потенциал сочетается с логическим мышлением. Способность видеть как 
                    общую картину, так и детали. Выраженные коммуникативные навыки, умение убеждать.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Коннектор: 5 | {getArchetypeByCode(5)}</h4>
                  <p className="text-sm mt-1">
                    Стремление к свободе и независимости. Любовь к путешествиям и новым впечатлениям.
                    Адаптивность к изменениям и умение быстро осваиваться в новых ситуациях.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Реализация: 2 | {getArchetypeByCode(2)}</h4>
                  <p className="text-sm mt-1">
                    Склонность к сотрудничеству и совместной работе. Дипломатичность и умение
                    находить компромисс. Ориентация на гармоничные отношения в команде.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Генератор: 1 | {getArchetypeByCode(1)}</h4>
                  <p className="text-sm mt-1">
                    Лидерские качества и умение инициировать новые проекты. Независимость
                    в принятии решений и способность брать на себя ответственность.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Миссия: 5 | {getArchetypeByCode(5)}</h4>
                  <p className="text-sm mt-1">
                    Стремление к свободе и независимости в профессиональной реализации. 
                    Желание исследовать различные пути развития и делиться своим опытом с другими.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="atlas" className="p-4">
              <h3 className="font-medium mb-2">Атлас архетипов</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Архетип: Творец (3)</h4>
                  <p className="text-sm mt-1">
                    Ключевые характеристики: инновационность, творческий подход, стремление к самовыражению.
                    Потенциальные вызовы: перфекционизм, трудности с завершением проектов.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Архетип: Путешественник (5)</h4>
                  <p className="text-sm mt-1">
                    Ключевые характеристики: свобода, независимость, любознательность, адаптивность.
                    Потенциальные вызовы: непостоянство, трудности с долгосрочными обязательствами.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Архетип: Партнер (2)</h4>
                  <p className="text-sm mt-1">
                    Ключевые характеристики: сотрудничество, дипломатия, эмпатия, умение слушать.
                    Потенциальные вызовы: зависимость от мнения других, трудности с самостоятельными решениями.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Архетип: Лидер (1)</h4>
                  <p className="text-sm mt-1">
                    Ключевые характеристики: инициативность, решительность, ответственность, амбициозность.
                    Потенциальные вызовы: авторитарность, трудности с делегированием, нетерпеливость.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="diagnostics" className="p-4">
              <h3 className="font-medium mb-2">Диагностика</h3>
              <div className="space-y-2">
                <p className="text-sm">Зона комфорта: Творческая деятельность, исследование новых возможностей, работа в команде.</p>
                <p className="text-sm">Зона развития: Завершение проектов, долгосрочное планирование, развитие дисциплины.</p>
                <p className="text-sm">Потенциал роста: Высокий в сферах, связанных с инновациями, консультированием, обучением.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="p-4">
              <h3 className="font-medium mb-2">Готовый анализ</h3>
              <div className="space-y-4">
                <p className="text-sm">
                  Клиент сочетает в себе творческое мышление (код 3) с независимостью и адаптивностью (код 5).
                  Эти качества дополняются склонностью к сотрудничеству (код 2) и лидерскими способностями (код 1).
                </p>
                <p className="text-sm">
                  В профессиональной сфере наиболее подходящими будут роли, связанные с креативной деятельностью,
                  которая предоставляет достаточную свободу и возможность работать с людьми.
                  Возможные направления: консультирование, образование, творческие профессии, руководящие позиции в
                  сфере инноваций.
                </p>
                <p className="text-sm">
                  В отношениях ценит как свободу, так и глубину связи. Важно создавать баланс между
                  независимостью и эмоциональной близостью. Партнерские отношения с взаимным уважением
                  к личным границам будут наиболее гармоничными.
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
        
        <div className="border-t border-border pt-4 flex justify-between mb-8">
          <Button variant="outline" onClick={onAddReminder}>
            <Bell className="mr-2 h-4 w-4" />
            Добавить напоминание
          </Button>
          
          <div>
            <Button variant="outline" className="mr-2" onClick={handleScheduleNext}>
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
    </div>
  );
}
