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
import { 
  CalendarIcon, Clock, CheckCircle2, AlertTriangle, 
  CreditCard, MessageSquare, Users, User, Phone, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

const consultationTypes = [
  { id: 1, name: "Индивидуальная консультация", duration: 60, price: 3500 },
  { id: 2, name: "Семейная консультация", duration: 90, price: 5000 },
  { id: 3, name: "Диагностика", duration: 45, price: 2500 },
  { id: 4, name: "Экспресс-консультация", duration: 30, price: 1500 },
];

const useConsultantInfo = (consultantId: string) => {
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);
  
  useEffect(() => {
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
        reviews: [
          { id: 1, name: "Анна К.", rating: 5, text: "Отличная консультация, очень помогла разобраться с моими вопросами.", date: "2025-03-15" },
          { id: 2, name: "Михаил П.", rating: 4, text: "Профессиональный подход, рекомендую.", date: "2025-03-10" },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [consultantId]);
  
  return { consultant, loading };
};

const generateTimeSlots = (date: Date, schedule: any, selectedConsultationType: number) => {
  const slots: string[] = [];
  const dayOfWeek = format(date, "EEEE", { locale: ru }).toLowerCase();
  
  if (!schedule.workingDays.includes(dayOfWeek)) {
    return slots;
  }
  
  const selectedType = consultationTypes.find(type => type.id === selectedConsultationType);
  const consultationDuration = selectedType ? selectedType.duration : schedule.appointmentDuration;
  
  const [startHour, startMinute] = schedule.workingHours.start.split(":").map(Number);
  const [endHour, endMinute] = schedule.workingHours.end.split(":").map(Number);
  
  const slotInterval = consultationDuration + schedule.breakBetweenAppointments;
  
  let currentSlot = new Date(date);
  currentSlot.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);
  
  const dateString = format(date, "yyyy-MM-dd");
  
  const todayBreaks = schedule.breaks.filter((b: any) => b.date === dateString);
  
  while (isBefore(currentSlot, endTime)) {
    const slotEndTime = new Date(currentSlot);
    slotEndTime.setMinutes(slotEndTime.getMinutes() + consultationDuration);
    
    const isBooked = schedule.existingAppointments.some((app: string) => {
      const appTime = new Date(app);
      return (
        format(appTime, "yyyy-MM-dd") === format(currentSlot, "yyyy-MM-dd") &&
        format(appTime, "HH:mm") === format(currentSlot, "HH:mm")
      );
    });
    
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
    
    if (!isBooked && !isBreak) {
      slots.push(format(currentSlot, "HH:mm"));
    }
    
    currentSlot.setMinutes(currentSlot.getMinutes() + slotInterval);
  }
  
  return slots;
};

const getConsultationPrice = (consultationTypeId: number) => {
  const selectedType = consultationTypes.find(type => type.id === consultationTypeId);
  return selectedType ? selectedType.price : 3500;
};

const formatRating = (rating: number) => {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
};

export function PublicBookingPage() {
  const { consultantId } = useParams<{ consultantId: string }>();
  const { consultant, loading } = useConsultantInfo(consultantId || "");
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("date");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  const [selectedConsultationType, setSelectedConsultationType] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>("online");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  
  useEffect(() => {
    if (selectedDate && consultant) {
      const slots = generateTimeSlots(selectedDate, consultant.schedule, selectedConsultationType);
      setAvailableTimeSlots(slots);
      setSelectedTime(null);
    }
  }, [selectedDate, consultant, selectedConsultationType]);
  
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setActiveTab("info");
  };
  
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    setIsConfirmationOpen(true);
  };
  
  const handleConfirmBooking = () => {
    setIsConfirmationOpen(false);
    setIsBookingComplete(true);
    setBookingReference(`BK-${Math.floor(Math.random() * 10000)}`);
  };
  
  const handleSubmitReview = () => {
    if (reviewText.trim() === "") {
      toast.error("Пожалуйста, напишите текст отзыва");
      return;
    }
    
    toast.success("Спасибо за ваш отзыв!");
    setIsReviewOpen(false);
  };
  
  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "d MMMM yyyy", { locale: ru });
  };
  
  const isWorkingDay = (date: Date) => {
    if (!consultant) return false;
    
    const dayOfWeek = format(date, "EEEE", { locale: ru }).toLowerCase();
    return consultant.schedule.workingDays.includes(dayOfWeek);
  };
  
  const getSelectedConsultationType = () => {
    return consultationTypes.find(type => type.id === selectedConsultationType);
  };
  
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
                <p>Тип консультации: <span className="font-medium">{getSelectedConsultationType()?.name}</span></p>
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
          <CardFooter className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Записаться снова
            </Button>
            <Button onClick={() => setIsReviewOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Оставить отзыв
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="date">1. Дата и время</TabsTrigger>
              <TabsTrigger value="type" disabled={!selectedTime}>2. Тип консультации</TabsTrigger>
              <TabsTrigger value="info" disabled={!selectedTime}>3. Ваши данные</TabsTrigger>
            </TabsList>
            
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
                    className="rounded-md border"
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

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Отзывы клиентов</h3>
                    {consultant.reviews && consultant.reviews.length > 0 ? (
                      <div className="space-y-3">
                        {consultant.reviews.map((review: any) => (
                          <div key={review.id} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between">
                              <span className="font-medium">{review.name}</span>
                              <span className="text-amber-500">{formatRating(review.rating)}</span>
                            </div>
                            <p className="text-sm mt-1">{review.text}</p>
                            <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Пока нет отзывов</p>
                    )}
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
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  disabled={!selectedTime}
                  onClick={() => setActiveTab("type")}
                >
                  Продолжить
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="type" className="py-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Выберите тип консультации</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {consultationTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedConsultationType === type.id
                            ? "border-primary bg-primary/5"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedConsultationType(type.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Продолжительность: {type.duration} минут
                            </p>
                          </div>
                          <div className="text-lg font-medium text-green-600">
                            {type.price.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Выберите способ оплаты</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className={`flex items-start space-x-3 p-4 border rounded-lg ${
                      paymentMethod === "online" ? "border-primary bg-primary/5" : ""
                    }`}>
                      <RadioGroupItem value="online" id="online" />
                      <div className="flex-1">
                        <Label htmlFor="online" className="font-medium">Онлайн-оплата</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Оплатите консультацию сейчас банковской картой
                        </p>
                      </div>
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className={`flex items-start space-x-3 p-4 border rounded-lg ${
                      paymentMethod === "office" ? "border-primary bg-primary/5" : ""
                    }`}>
                      <RadioGroupItem value="office" id="office" />
                      <div className="flex-1">
                        <Label htmlFor="office" className="font-medium">Оплата при встрече</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Оплатите консультацию при личной встрече
                        </p>
                      </div>
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Детали выбранной консультации:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Дата и время:</span>
                      <span className="font-medium">
                        {formatDisplayDate(selectedDate)}, {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Тип консультации:</span>
                      <span className="font-medium">
                        {getSelectedConsultationType()?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Продолжительность:</span>
                      <span className="font-medium">
                        {getSelectedConsultationType()?.duration} минут
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Стоимость:</span>
                      <span className="font-medium text-green-600">
                        {getSelectedConsultationType()?.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("date")}
                  >
                    Назад
                  </Button>
                  <Button onClick={() => setActiveTab("info")}>
                    Продолжить
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="py-6">
              <form onSubmit={handleSubmitForm}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Введите ваши данные</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Имя *
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Фамилия *
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Телефон *
                        </Label>
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
                    <Label htmlFor="request" className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Опишите свой запрос
                    </Label>
                    <Textarea
                      id="request"
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      placeholder="Расскажите, с какими вопросами вы хотите обратиться к консультанту"
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Это поможет консультанту лучше подготовиться к встрече с вами
                    </p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Информация о записи:</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Дата и время:</span>
                        <span className="font-medium">
                          {formatDisplayDate(selectedDate)}, {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Тип консультации:</span>
                        <span className="font-medium">
                          {getSelectedConsultationType()?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Способ оплаты:</span>
                        <span className="font-medium">
                          {paymentMethod === "online" ? "Онлайн-оплата" : "Оплата при встрече"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Стоимость:</span>
                        <span className="font-medium text-green-600">
                          {getSelectedConsultationType()?.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("type")}
                    >
                      Назад
                    </Button>
                    <Button type="submit">
                      {paymentMethod === "online" ? "Перейти к оплате" : "Записаться на консультацию"}
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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
              <p>Тип консультации: <span className="font-medium">{getSelectedConsultationType()?.name}</span></p>
              <p>Стоимость: <span className="font-medium text-green-600">
                {getSelectedConsultationType()?.price.toLocaleString('ru-RU')} ₽
              </span></p>
              <p>Способ оплаты: <span className="font-medium">
                {paymentMethod === "online" ? "Онлайн-оплата" : "Оплата при встрече"}
              </span></p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Ваши данные:</h3>
              <p>Имя: <span className="font-medium">{firstName} {lastName}</span></p>
              <p>Email: <span className="font-medium">{email}</span></p>
              <p>Телефон: <span className="font-medium">{phone}</span></p>
              {request && (
                <div className="mt-2">
                  <p className="font-medium">Ваш запрос:</p>
                  <p className="text-sm mt-1">{request}</p>
                </div>
              )}
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
      
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оставить отзыв</DialogTitle>
            <DialogDescription>
              Поделитесь своим опытом с другими клиентами
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Оценка</Label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`text-2xl focus:outline-none ${
                      rating <= reviewRating ? "text-amber-500" : "text-gray-300"
                    }`}
                    onClick={() => setReviewRating(rating)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reviewText">Ваш отзыв</Label>
              <Textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Расскажите о вашем опыте консультации"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewOpen(false)}
            >
              Отменить
            </Button>
            <Button onClick={handleSubmitReview}>
              Отправить отзыв
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
