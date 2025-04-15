
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users, Plus, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, addWeeks, subWeeks, isSameDay, parse, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { AppointmentForm } from "@/components/calendar/AppointmentForm";
import { WeekViewCell } from "@/components/calendar/WeekViewCell";
import { DetailedMonthView } from "@/components/calendar/DetailedMonthView";

// Пример данных о встречах
const appointmentsData = [
  { 
    id: 1, 
    clientName: "Анна Смирнова", 
    clientId: 1,
    date: new Date(2025, 3, 15, 10, 0), 
    duration: 60, 
    type: "Консультация",
    request: "Вопросы по личностному росту"
  },
  { 
    id: 2, 
    clientName: "Иван Петров", 
    clientId: 2,
    date: new Date(2025, 3, 15, 13, 30), 
    duration: 90, 
    type: "Полный анализ",
    request: "Проблемы в карьере, поиск направления" 
  },
  { 
    id: 3, 
    clientName: "Мария Иванова", 
    clientId: 3,
    date: new Date(2025, 3, 16, 11, 0), 
    duration: 45, 
    type: "Консультация",
    request: "Сложности в отношениях с партнером" 
  },
  { 
    id: 4, 
    clientName: "Александр Козлов", 
    clientId: 4,
    date: new Date(2025, 3, 17, 15, 0), 
    duration: 60, 
    type: "Базовый анализ",
    request: "Поиск предназначения" 
  },
  { 
    id: 5, 
    clientName: "Екатерина Новикова", 
    clientId: 5,
    date: new Date(2025, 3, 18, 12, 0), 
    duration: 60, 
    type: "Консультация",
    request: "Вопросы самореализации" 
  },
  { 
    id: 6, 
    clientName: "Дмитрий Соколов", 
    clientId: 6,
    date: new Date(2025, 3, 19, 9, 30), 
    duration: 45, 
    type: "Консультация",
    request: "Финансовые вопросы" 
  },
];

// Часы работы (с 9:00 до 19:00)
const workHours = Array.from({ length: 11 }, (_, i) => i + 9);

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("day");
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [appointments, setAppointments] = useState(appointmentsData);
  
  // Получение дней текущей недели
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Фильтрация встреч на выбранную дату
  const filteredAppointments = date 
    ? appointmentsData.filter(appointment => 
        appointment.date.getDate() === date.getDate() && 
        appointment.date.getMonth() === date.getMonth() && 
        appointment.date.getFullYear() === date.getFullYear()
      )
    : [];
  
  // Сортировка встреч по времени
  const sortedAppointments = [...filteredAppointments].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
  
  // Фильтрация встреч для недельного представления
  const weeklyAppointments = appointmentsData.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
  });
  
  // Обработчики навигации по неделям
  const goToPrevWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };
  
  const goToNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };
  
  // Получение встреч для конкретного дня
  const getAppointmentsForDay = (day: Date) => {
    return appointmentsData.filter(appointment => 
      isSameDay(appointment.date, day)
    );
  };
  
  // Получение встреч для конкретного часа и дня
  const getAppointmentsForHourAndDay = (hour: number, day: Date) => {
    return appointmentsData.filter(appointment => 
      isSameDay(appointment.date, day) && 
      appointment.date.getHours() === hour
    );
  };

  // Форматирование времени
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };
  
  // Обработчик выбора даты
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setCurrentWeek(newDate);
      setSelectedTab("day");
    }
  };
  
  // Получение деталей встречи по ID
  const getAppointmentById = (id: number) => {
    return appointmentsData.find(appointment => appointment.id === id);
  };
  
  // Обработчик закрытия деталей встречи
  const handleCloseAppointmentDetails = () => {
    setSelectedAppointment(null);
  };
  
  // Детали выбранной встречи
  const selectedAppointmentDetails = selectedAppointment 
    ? getAppointmentById(selectedAppointment) 
    : null;
    
  // Обработчик добавления новой встречи
  const handleAddAppointment = (data: any) => {
    console.log("Новая встреча:", data);
    // Здесь будет логика для добавления новой встречи
    // В реальном приложении, здесь будет API-запрос к бэкенду
    
    // Для примера, добавим встречу в список
    const newAppointment = {
      id: appointments.length + 1,
      clientName: data.clientName,
      clientId: data.clientId || 999, // ID клиента или временное значение
      date: data.appointmentDateTime || new Date(),
      duration: data.duration || 60,
      type: data.consultationType 
        ? ["Экспресс-консультация", "Базовый анализ", "Отношения", "Целевой анализ"][data.consultationType - 1] 
        : "Консультация",
      request: data.request || ""
    };
    
    setAppointments([...appointments, newAppointment]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Календарь</h1>
          <p className="text-muted-foreground">Планирование встреч с клиентами</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить встречу
        </Button>
      </div>

      <Tabs 
        defaultValue="day" 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="day">День</TabsTrigger>
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="month">Месяц</TabsTrigger>
        </TabsList>
        
        <TabsContent value="day" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Card className="astro-card border-none md:col-span-5 lg:col-span-4">
              <CardHeader className="pb-2">
                <CardTitle>Календарь</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  locale={ru}
                  className="mx-auto"
                />
              </CardContent>
            </Card>

            <Card className="astro-card border-none md:col-span-7 lg:col-span-8">
              <CardHeader className="pb-2">
                <CardTitle>
                  {date ? (
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                      {format(date, "d MMMM yyyy", { locale: ru })}
                    </div>
                  ) : (
                    "Встречи"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {sortedAppointments.map((appointment) => (
                      <Drawer key={appointment.id}>
                        <DrawerTrigger asChild>
                          <div 
                            className="p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedAppointment(appointment.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="min-w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{appointment.clientName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                  <div className="flex items-center mt-2 text-sm">
                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                    <span>
                                      {format(appointment.date, "HH:mm")} - {format(new Date(appointment.date.getTime() + appointment.duration * 60000), "HH:mm")}
                                    </span>
                                    <span className="mx-1 text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">{appointment.duration} мин</span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="shrink-0">
                                {appointment.type}
                              </Badge>
                            </div>
                          </div>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Детали консультации</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{appointment.clientName}</h3>
                                  <Link 
                                    to={`/clients/${appointment.clientId}`} 
                                    className="text-sm text-primary hover:underline"
                                  >
                                    Профиль клиента
                                  </Link>
                                </div>
                              </div>
                              <Badge>{appointment.type}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Дата и время</p>
                                <p className="font-medium">
                                  {format(appointment.date, "d MMMM yyyy, HH:mm", { locale: ru })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Продолжительность</p>
                                <p className="font-medium">{appointment.duration} минут</p>
                              </div>
                            </div>
                            
                            <div className="border-t border-border pt-4">
                              <p className="text-sm text-muted-foreground mb-1">Запрос клиента</p>
                              <p>{appointment.request}</p>
                            </div>
                            
                            <div className="border-t border-border pt-4">
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-medium">Связанные анализы</p>
                                <Button variant="outline" size="sm" className="h-8">
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Новый анализ
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <div className="p-3 border rounded-md flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Базовый анализ</p>
                                    <p className="text-sm text-muted-foreground">Создан 12.03.2025</p>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/analysis/1`}>
                                      <Eye className="h-4 w-4 mr-1" />
                                      Просмотр
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button variant="outline">Редактировать</Button>
                              <Button variant="destructive">Отменить встречу</Button>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Нет запланированных встреч</h3>
                    <p className="text-muted-foreground mt-1">
                      {date ? "На выбранную дату нет встреч" : "Выберите дату в календаре"}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить встречу
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="week">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {format(weekStart, "d MMMM", { locale: ru })} - {format(weekEnd, "d MMMM yyyy", { locale: ru })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={goToPrevWeek}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentWeek(new Date())}>
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextWeek}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 border-b pb-2">
                <div className="px-2 py-2 font-medium text-sm text-center">Время</div>
                {daysOfWeek.map((day, index) => (
                  <div 
                    key={index} 
                    className={`px-2 py-2 text-center ${isToday(day) ? 'bg-primary/10 rounded-t-md' : ''}`}
                  >
                    <p className="font-medium">{format(day, "E", { locale: ru })}</p>
                    <p className={`text-sm ${isToday(day) ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {format(day, "d", { locale: ru })}
                    </p>
                  </div>
                ))}
              </div>
              
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-8">
                  {workHours.map((hour) => (
                    <React.Fragment key={hour}>
                      {/* Временные слоты */}
                      <div className="border-b border-r p-2 text-sm text-muted-foreground">
                        {hour}:00
                      </div>
                      
                      {/* Дни недели */}
                      {daysOfWeek.map((day, dayIndex) => (
                        <WeekViewCell
                          key={dayIndex}
                          day={day}
                          hour={hour}
                          appointments={getAppointmentsForHourAndDay(hour, day)}
                          onAppointmentClick={(id) => setSelectedAppointment(id)}
                          onAddAppointment={handleAddAppointment}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="month">
          <DetailedMonthView
            currentDate={date || new Date()}
            appointments={appointments}
            onAppointmentClick={(id) => setSelectedAppointment(id)}
            onAddAppointment={handleAddAppointment}
          />
        </TabsContent>
      </Tabs>
      
      <AppointmentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        initialDate={date}
        onSubmit={handleAddAppointment}
      />
    </div>
  );
};

export default Calendar;
