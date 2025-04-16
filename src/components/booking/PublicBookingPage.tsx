
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, isAfter, isBefore, addDays, setHours, setMinutes, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Имитация данных о доступности
const mockSchedule = {
  workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  workingHours: {
    start: "09:00",
    end: "18:00",
  },
  appointmentDuration: 60,
  breakBetweenAppointments: 15,
  existingAppointments: [
    "2025-04-18T10:00:00",
    "2025-04-18T14:00:00",
    "2025-04-19T11:00:00",
  ],
  breaks: [
    {
      date: "2025-04-17",
      startTime: "12:00",
      endTime: "13:00",
      reason: "Обеденный перерыв",
    },
    {
      date: "2025-04-18",
      startTime: "12:00",
      endTime: "13:00",
      reason: "Обеденный перерыв",
    },
  ],
};

// Хук для имитации получения данных о специалисте
const useConsultantInfo = (consultantId: string) => {
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);
  
  useEffect(() => {
    // Имитация запроса к API
    setTimeout(() => {
      setConsultant({
        id: consultantId,
        name: "Мастер Анализа",
        title: "Психолог-консультант",
        description: "Профессиональный психолог с опытом работы более 5 лет. Специализируюсь на психоанализе и когнитивно-поведенческой терапии.",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        pricing: {
          initial: 3500,
          followUp: 3000,
        },
        schedule: mockSchedule,
      });
      setLoading(false);
    }, 1000);
  }, [consultantId]);
  
  return { consultant, loading };
};

// Генерация доступных слотов времени
const generateTimeSlots = (date: Date, schedule: any) => {
  const slots: string[] = [];
  const dayOfWeek = format(date, "EEEE", { locale: ru }).toLowerCase();
  
  // Проверяем, является ли день рабочим
  if (!schedule.workingDays.includes(dayOfWeek)) {
    return slots;
  }
  
  // Парсим часы начала и конца рабочего дня
  const [startHour, startMinute] = schedule.workingHours.start.split(":").map(Number);
  const [endHour, endMinute] = schedule.workingHours.end.split(":").map(Number);
  
  // Расчет интервала слотов: длительность консультации + перерыв
  const slotInterval = schedule.appointmentDuration + schedule.breakBetweenAppointments;
  
  // Начало рабочего дня
  let currentSlot = new Date(date);
  currentSlot.setHours(startHour, startMinute, 0, 0);
  
  // Конец рабочего дня
  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);
  
  // Строковое представление текущей даты (для поиска перерывов)
  const dateString = format(date, "yyyy-MM-dd");
  
  // Получение перерывов на эту дату
  const todayBreaks = schedule.breaks.filter((b: any) => b.date === dateString);
  
  // Генерация слотов времени
  while (isBefore(currentSlot, endTime)) {
    const slotEndTime = new Date(currentSlot);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + schedule.appointmentDuration);
    
    // Проверка на существующие записи
    const isBooked = schedule.existingAppointments.some((app: string) => {
      const appTime = new Date(app);
      return (
        format(appTime, "yyyy-MM-dd") === format(currentSlot, "yyyy-MM-dd") &&
        format(appTime, "HH:mm") === format(currentSlot, "HH:mm")
      );
    });
    
    // Проверка на перерывы
    const isBreak = todayBreaks.some((b: any) => {
      const breakStart = new Date(date);
      const [bStartHour, bStartMinute] = b.startTime.split(":").map(Number);
      breakStart.setHours(bStartHour, bStartMinute, 0, 0);
      
      const breakEnd = new Date(date);
      const [bEndHour, bEndMinute] = b.endTime.split(":").map(Number);
      breakEnd.setHours(bEndHour, bEndMinute, 0, 0);
      
      return (
        (isAfter(currentSlot, breakStart) || format(currentSlot, "HH:mm") === format(breakStart, "HH:mm")) &&
        (isBefore(currentSlot, breakEnd))
      );
    });
    
    // Если слот не занят и не во время перерыва, добавляем его
    if (!isBooked && !isBreak) {
      slots.push(format(currentSlot, "HH:mm"));
    }
    
    // Переходим к следующему слоту
    currentSlot.setMinutes(currentSlot.getMinutes() + slotInterval);
  }
  
  return slots;
};

export function PublicBookingPage() {
  const { consultantId } = useParams<{ consultantId: string }>();
  const { consultant, loading } = useConsultantInfo(consultantId || "");
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("date");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  
  // Данные формы клиента
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  
  // Состояние успешной записи
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  
  // Обновление доступных слотов при изменении даты
  useEffect(() => {
    if (selectedDate && consultant) {
      const slots = generateTimeSlots(selectedDate, consultant.schedule);
      setAvailableTimeSlots(slots);
      setSelectedTime(null);
    }
  }, [selectedDate, consultant]);
  
  // Обработчик выбора времени
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setActiveTab("info");
  };
  
  // Обработчик отправки формы
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    // Открытие диалога подтверждения
    setIsConfirmationOpen(true);
  };
  
  // Обработчик подтверждения записи
  const handleConfirmBooking = () => {
    // Здесь будет логика отправки данных на сервер
    
    // Имитация успешной записи
    setIsConfirmationOpen(false);
    setIsBookingComplete(true);
    setBookingReference(`BK-${Math.floor(Math.random() * 10000)}`);
  };
  
  // Форматирование даты для отображения
  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "d MMMM yyyy", { locale: ru });
  };
  
  // Определение функции для проверки, является ли день рабочим
  const isWorkingDay = (date: Date) => {
    if (!consultant) return false;
    
    const dayOfWeek = format(date, "EEEE", { locale: ru }).toLowerCase();
    return consultant.schedule.workingDays.includes(dayOfWeek);
  };
  
  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Загрузка расписания...</p>
        </div>
      </div>
    );
  }
  
  // Если консультант не найден, показываем сообщение об ошибке
  if (!consultant) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Страница не найдена</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="mb-4">
                Извините, но запрошенный консультант не найден или ссылка недействительна.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Вернуться на главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Если запись успешно завершена, показываем сообщение об успехе
  if (isBookingComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Запись успешно завершена</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
            
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-lg">
                Спасибо, {firstName}! Ваша запись на консультацию подтверждена.
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Детали вашей записи:</h3>
                <p>Дата: <span className="font-medium">{formatDisplayDate(selectedDate)}</span></p>
                <p>Время: <span className="font-medium">{selectedTime}</span></p>
                <p>Консультант: <span className="font-medium">{consultant.name}</span></p>
                <p>Номер записи: <span className="font-medium">{bookingReference}</span></p>
              </div>
              
              <p>
                Мы отправили подтверждение на указанный вами email: <span className="font-medium">{email}</span>
              </p>
              
              <p className="text-muted-foreground mt-4">
                Если у вас возникнут вопросы или вам потребуется изменить запись, пожалуйста, свяжитесь с нами.
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => window.location.reload()}>
              Записаться снова
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <img 
                src={consultant.photo} 
                alt={consultant.name} 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <CardTitle className="text-2xl">{consultant.name}</CardTitle>
          <CardDescription className="text-lg">{consultant.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">{consultant.description}</p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date">1. Дата и время</TabsTrigger>
              <TabsTrigger value="info" disabled={!selectedTime}>2. Ваши данные</TabsTrigger>
            </TabsList>
            
            {/* Вкладка выбора даты и времени */}
            <TabsContent value="date" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Выберите дату</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => 
                      date < new Date() ||
                      !isWorkingDay(date)
                    }
                    className={cn("rounded-md border")}
                  />
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Доступны только рабочие дни консультанта.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Доступные дни</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Время на {formatDisplayDate(selectedDate)}
                  </h3>
                  
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className="text-center"
                          onClick={() => handleSelectTime(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 border rounded-md">
                      <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Нет доступных слотов на выбранную дату.
                        <br />
                        Пожалуйста, выберите другую дату.
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Информация о консультации</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center border-b py-2">
                        <span>Тип консультации</span>
                        <span className="font-medium">Первичная консультация</span>
                      </div>
                      <div className="flex justify-between items-center border-b py-2">
                        <span>Длительность</span>
                        <span className="font-medium">
                          {consultant.schedule.appointmentDuration} минут
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b py-2">
                        <span>Стоимость</span>
                        <span className="font-medium text-green-600">
                          {consultant.pricing.initial.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  disabled={!selectedTime}
                  onClick={() => setActiveTab("info")}
                >
                  Продолжить
                </Button>
              </div>
            </TabsContent>
            
            {/* Вкладка ввода информации о клиенте */}
            <TabsContent value="info" className="py-6">
              <form onSubmit={handleSubmitForm}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Ваша запись</h3>
                    <div className="bg-muted p-4 rounded-md mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Дата</p>
                          <p className="font-medium">
                            {formatDisplayDate(selectedDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Время</p>
                          <p className="font-medium">{selectedTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Стоимость</p>
                          <p className="font-medium text-green-600">
                            {consultant.pricing.initial.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Ваши данные</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя *</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия *</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="request">
                      Опишите свой запрос (необязательно)
                    </Label>
                    <Textarea
                      id="request"
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      placeholder="Расскажите, с какими вопросами вы хотите обратиться к консультанту"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("date")}
                    >
                      Назад
                    </Button>
                    <Button type="submit">
                      Записаться на консультацию
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Диалог подтверждения */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение записи</DialogTitle>
            <DialogDescription>
              Пожалуйста, проверьте данные вашей записи перед подтверждением
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Детали записи:</h3>
              <p>Консультант: <span className="font-medium">{consultant.name}</span></p>
              <p>Дата: <span className="font-medium">{formatDisplayDate(selectedDate)}</span></p>
              <p>Время: <span className="font-medium">{selectedTime}</span></p>
              <p>Стоимость: <span className="font-medium text-green-600">{consultant.pricing.initial.toLocaleString('ru-RU')} ₽</span></p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Ваши данные:</h3>
              <p>Имя: <span className="font-medium">{firstName} {lastName}</span></p>
              <p>Email: <span className="font-medium">{email}</span></p>
              <p>Телефон: <span className="font-medium">{phone}</span></p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmationOpen(false)}
            >
              Отменить
            </Button>
            <Button onClick={handleConfirmBooking}>
              Подтвердить запись
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
