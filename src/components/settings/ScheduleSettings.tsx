
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, Copy, Calendar as CalendarIcon, AlertTriangle, Loader2, 
  UserCog, CreditCard, MessageSquare, PlusCircle, Trash2, Settings as SettingsIcon
} from "lucide-react";
import { toast } from "sonner";
import { useScheduleManagement, WorkSchedule, ConsultationType } from "@/hooks/useScheduleManagement";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ScheduleSettings() {
  const {
    settings,
    loading,
    updateWorkingDay,
    updateWorkingHours,
    updateAppointmentDuration,
    updateBreakBetweenAppointments,
    updateBookingLinkEnabled,
    updateBookingLink,
    addBreak,
    removeBreak,
    addConsultationType,
    updateConsultationType,
    removeConsultationType,
    updatePaymentMethodEnabled,
    updateAutoConfirmBookings,
    updateNotificationEmail,
    updateCancellationPolicy,
    saveSettings,
    getBookingUrl,
  } = useScheduleManagement();
  
  // Локальное состояние для ввода перерыва
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [breakStartTime, setBreakStartTime] = useState<string>("12:00");
  const [breakEndTime, setBreakEndTime] = useState<string>("13:00");
  const [breakReason, setBreakReason] = useState<string>("Обеденный перерыв");
  
  // Состояние для управления диалогом типа консультации
  const [isConsultationTypeDialogOpen, setIsConsultationTypeDialogOpen] = useState(false);
  const [editingConsultationType, setEditingConsultationType] = useState<ConsultationType | null>(null);
  const [newConsultationName, setNewConsultationName] = useState("");
  const [newConsultationDuration, setNewConsultationDuration] = useState("60");
  const [newConsultationPrice, setNewConsultationPrice] = useState("3500");
  const [newConsultationDescription, setNewConsultationDescription] = useState("");
  
  // Текущая активная вкладка
  const [activeTab, setActiveTab] = useState("schedule");
  
  // Обработчик изменения рабочего дня
  const handleDayToggle = (day: keyof WorkSchedule) => {
    updateWorkingDay(day, !settings.workSchedule[day].enabled);
  };
  
  // Обработчик добавления нового перерыва
  const handleAddBreak = () => {
    if (!selectedDate) {
      toast.error("Выберите дату для перерыва");
      return;
    }
    
    addBreak({
      date: selectedDate,
      startTime: breakStartTime,
      endTime: breakEndTime,
      reason: breakReason,
    });
    
    toast.success("Перерыв добавлен");
  };
  
  // Копирование ссылки для записи
  const handleCopyBookingLink = () => {
    const bookingURL = getBookingUrl();
    navigator.clipboard.writeText(bookingURL);
    toast.success("Ссылка скопирована в буфер обмена", {
      description: bookingURL,
    });
  };
  
  // Обработчик открытия диалога для добавления/редактирования типа консультации
  const handleOpenConsultationTypeDialog = (type?: ConsultationType) => {
    if (type) {
      setEditingConsultationType(type);
      setNewConsultationName(type.name);
      setNewConsultationDuration(type.duration.toString());
      setNewConsultationPrice(type.price.toString());
      setNewConsultationDescription(type.description || "");
    } else {
      setEditingConsultationType(null);
      setNewConsultationName("");
      setNewConsultationDuration("60");
      setNewConsultationPrice("3500");
      setNewConsultationDescription("");
    }
    setIsConsultationTypeDialogOpen(true);
  };
  
  // Обработчик сохранения типа консультации
  const handleSaveConsultationType = () => {
    // Валидация данных
    if (!newConsultationName.trim()) {
      toast.error("Введите название типа консультации");
      return;
    }
    
    const duration = parseInt(newConsultationDuration);
    const price = parseInt(newConsultationPrice);
    
    if (isNaN(duration) || duration <= 0) {
      toast.error("Введите корректную продолжительность");
      return;
    }
    
    if (isNaN(price) || price <= 0) {
      toast.error("Введите корректную цену");
      return;
    }
    
    if (editingConsultationType) {
      // Обновление существующего типа
      updateConsultationType(editingConsultationType.id, {
        name: newConsultationName,
        duration,
        price,
        description: newConsultationDescription,
      });
      toast.success(`Тип консультации "${newConsultationName}" обновлен`);
    } else {
      // Добавление нового типа
      addConsultationType({
        name: newConsultationName,
        duration,
        price,
        description: newConsultationDescription,
      });
      toast.success(`Тип консультации "${newConsultationName}" добавлен`);
    }
    
    setIsConsultationTypeDialogOpen(false);
  };
  
  // Сохранение настроек
  const handleSaveSettings = () => {
    const saved = saveSettings();
    if (saved) {
      toast.success("Настройки сохранены");
    } else {
      toast.error("Ошибка при сохранении настроек");
    }
  };
  
  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Загрузка настроек...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="schedule" className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Рабочие часы
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center">
            <UserCog className="mr-2 h-4 w-4" />
            Услуги и оплата
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Дополнительно
          </TabsTrigger>
        </TabsList>
        
        {/* Вкладка рабочих часов */}
        <TabsContent value="schedule">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Настройки графика работы</CardTitle>
              <CardDescription>
                Настройте дни и часы, в которые вы принимаете клиентов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Рабочие дни */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Рабочие дни</h3>
                
                {/* Понедельник */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.monday.enabled} 
                      onCheckedChange={() => handleDayToggle('monday')} 
                      id="monday"
                    />
                    <Label htmlFor="monday">Понедельник</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.monday.hours.start}
                      onChange={(e) => updateWorkingHours('monday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.monday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.monday.hours.end}
                      onChange={(e) => updateWorkingHours('monday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.monday.enabled}
                    />
                  </div>
                </div>
                
                {/* Вторник */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.tuesday.enabled} 
                      onCheckedChange={() => handleDayToggle('tuesday')} 
                      id="tuesday"
                    />
                    <Label htmlFor="tuesday">Вторник</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.tuesday.hours.start}
                      onChange={(e) => updateWorkingHours('tuesday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.tuesday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.tuesday.hours.end}
                      onChange={(e) => updateWorkingHours('tuesday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.tuesday.enabled}
                    />
                  </div>
                </div>
                
                {/* Среда */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.wednesday.enabled} 
                      onCheckedChange={() => handleDayToggle('wednesday')} 
                      id="wednesday"
                    />
                    <Label htmlFor="wednesday">Среда</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.wednesday.hours.start}
                      onChange={(e) => updateWorkingHours('wednesday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.wednesday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.wednesday.hours.end}
                      onChange={(e) => updateWorkingHours('wednesday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.wednesday.enabled}
                    />
                  </div>
                </div>
                
                {/* Четверг */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.thursday.enabled} 
                      onCheckedChange={() => handleDayToggle('thursday')} 
                      id="thursday"
                    />
                    <Label htmlFor="thursday">Четверг</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.thursday.hours.start}
                      onChange={(e) => updateWorkingHours('thursday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.thursday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.thursday.hours.end}
                      onChange={(e) => updateWorkingHours('thursday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.thursday.enabled}
                    />
                  </div>
                </div>
                
                {/* Пятница */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.friday.enabled} 
                      onCheckedChange={() => handleDayToggle('friday')} 
                      id="friday"
                    />
                    <Label htmlFor="friday">Пятница</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.friday.hours.start}
                      onChange={(e) => updateWorkingHours('friday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.friday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.friday.hours.end}
                      onChange={(e) => updateWorkingHours('friday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.friday.enabled}
                    />
                  </div>
                </div>
                
                {/* Суббота */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.saturday.enabled} 
                      onCheckedChange={() => handleDayToggle('saturday')} 
                      id="saturday"
                    />
                    <Label htmlFor="saturday">Суббота</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.saturday.hours.start}
                      onChange={(e) => updateWorkingHours('saturday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.saturday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.saturday.hours.end}
                      onChange={(e) => updateWorkingHours('saturday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.saturday.enabled}
                    />
                  </div>
                </div>
                
                {/* Воскресенье */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.workSchedule.sunday.enabled} 
                      onCheckedChange={() => handleDayToggle('sunday')} 
                      id="sunday"
                    />
                    <Label htmlFor="sunday">Воскресенье</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.sunday.hours.start}
                      onChange={(e) => updateWorkingHours('sunday', 'start', e.target.value)}
                      disabled={!settings.workSchedule.sunday.enabled}
                    />
                    <span>—</span>
                    <Input 
                      type="time" 
                      className="w-28" 
                      value={settings.workSchedule.sunday.hours.end}
                      onChange={(e) => updateWorkingHours('sunday', 'end', e.target.value)}
                      disabled={!settings.workSchedule.sunday.enabled}
                    />
                  </div>
                </div>
              </div>
              
              {/* Настройки записи */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Настройки приёма</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDuration">Длительность консультации (минуты)</Label>
                    <Select 
                      value={settings.appointmentDuration.toString()} 
                      onValueChange={(value) => updateAppointmentDuration(parseInt(value))}
                    >
                      <SelectTrigger id="appointmentDuration">
                        <SelectValue placeholder="Выберите длительность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="30">30 минут</SelectItem>
                          <SelectItem value="45">45 минут</SelectItem>
                          <SelectItem value="60">60 минут</SelectItem>
                          <SelectItem value="90">90 минут</SelectItem>
                          <SelectItem value="120">120 минут</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="breakBetween">Перерыв между консультациями (минуты)</Label>
                    <Select 
                      value={settings.breakBetweenAppointments.toString()} 
                      onValueChange={(value) => updateBreakBetweenAppointments(parseInt(value))}
                    >
                      <SelectTrigger id="breakBetween">
                        <SelectValue placeholder="Выберите перерыв" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">Без перерыва</SelectItem>
                          <SelectItem value="5">5 минут</SelectItem>
                          <SelectItem value="10">10 минут</SelectItem>
                          <SelectItem value="15">15 минут</SelectItem>
                          <SelectItem value="30">30 минут</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Управление перерывами */}
          <Card className="border-none mt-6">
            <CardHeader>
              <CardTitle>Управление перерывами</CardTitle>
              <CardDescription>
                Добавьте перерывы в свой график, чтобы заблокировать время для личных дел
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Выберите дату перерыва</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="breakStart">Время начала</Label>
                    <Input 
                      id="breakStart" 
                      type="time" 
                      value={breakStartTime}
                      onChange={(e) => setBreakStartTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="breakEnd">Время окончания</Label>
                    <Input 
                      id="breakEnd" 
                      type="time" 
                      value={breakEndTime}
                      onChange={(e) => setBreakEndTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="breakReason">Причина перерыва</Label>
                    <Input 
                      id="breakReason" 
                      value={breakReason}
                      onChange={(e) => setBreakReason(e.target.value)}
                      placeholder="Например: Обед, Встреча и т.д."
                    />
                  </div>
                  
                  <Button className="w-full" onClick={handleAddBreak}>
                    Добавить перерыв
                  </Button>
                </div>
              </div>
              
              {/* Список перерывов */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Текущие перерывы</h3>
                
                {settings.breaks.length === 0 ? (
                  <div className="text-center p-6 border rounded-md">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">У вас пока нет запланированных перерывов</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.breaks.map((breakItem) => (
                      <div 
                        key={breakItem.id} 
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div>
                          <div className="font-medium">
                            {format(breakItem.date, "d MMMM yyyy", { locale: ru })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {breakItem.startTime} — {breakItem.endTime} · {breakItem.reason}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeBreak(breakItem.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Вкладка услуг и оплаты */}
        <TabsContent value="services">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Типы консультаций</CardTitle>
              <CardDescription>
                Настройте типы консультаций, которые вы предоставляете
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => handleOpenConsultationTypeDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить тип консультации
                  </Button>
                </div>
                
                {settings.consultationTypes.length === 0 ? (
                  <div className="text-center p-6 border rounded-md">
                    <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">У вас пока нет настроенных типов консультаций</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {settings.consultationTypes.map((type) => (
                      <div key={type.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{type.name}</h3>
                            <div className="flex mt-1 space-x-4 text-sm text-muted-foreground">
                              <span>Длительность: {type.duration} мин.</span>
                              <span>Цена: {type.price.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            {type.description && (
                              <p className="text-sm mt-2">{type.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleOpenConsultationTypeDialog(type)}
                            >
                              Изменить
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => removeConsultationType(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none mt-6">
            <CardHeader>
              <CardTitle>Способы оплаты</CardTitle>
              <CardDescription>
                Настройте доступные способы оплаты для клиентов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </div>
                    <Switch 
                      checked={method.enabled} 
                      onCheckedChange={(enabled) => updatePaymentMethodEnabled(method.id, enabled)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Вкладка дополнительных настроек */}
        <TabsContent value="advanced">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Настройки бронирования</CardTitle>
              <CardDescription>
                Дополнительные настройки для онлайн-записи
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ссылка для записи */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Публичная ссылка для записи</h3>
                  <Switch 
                    checked={settings.bookingLinkEnabled} 
                    onCheckedChange={updateBookingLinkEnabled} 
                    id="bookingLinkEnabled"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="bookingLink" className="sr-only">Ссылка для записи</Label>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground px-3 py-2 border border-r-0 rounded-l-md bg-muted">
                        {window.location.origin}/booking/
                      </span>
                      <Input 
                        id="bookingLink" 
                        value={settings.bookingLink} 
                        onChange={(e) => updateBookingLink(e.target.value)}
                        className="rounded-l-none"
                        disabled={!settings.bookingLinkEnabled}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleCopyBookingLink} 
                    disabled={!settings.bookingLinkEnabled}
                    variant="outline"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Копировать
                  </Button>
                </div>
                
                {settings.bookingLinkEnabled && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Любой, у кого есть эта ссылка, сможет записаться на консультацию
                  </div>
                )}
              </div>
              
              {/* Автоматическое подтверждение */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Автоматическое подтверждение записей</h3>
                    <p className="text-sm text-muted-foreground">
                      Автоматически подтверждать новые записи без вашего вмешательства
                    </p>
                  </div>
                  <Switch 
                    checked={settings.autoConfirmBookings} 
                    onCheckedChange={updateAutoConfirmBookings} 
                  />
                </div>
              </div>
              
              {/* Email для уведомлений */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Email для уведомлений</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    На этот адрес будут приходить уведомления о новых записях
                  </p>
                  <Input 
                    type="email" 
                    value={settings.notificationEmail} 
                    onChange={(e) => updateNotificationEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              {/* Политика отмены */}
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Политика отмены записи</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Эта информация будет показана клиентам при бронировании
                  </p>
                  <Textarea 
                    value={settings.cancellationPolicy} 
                    onChange={(e) => updateCancellationPolicy(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Сохранить настройки
        </Button>
      </div>
      
      {/* Диалог добавления/редактирования типа консультации */}
      <Dialog open={isConsultationTypeDialogOpen} onOpenChange={setIsConsultationTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingConsultationType ? "Редактировать тип консультации" : "Добавить тип консультации"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="consultationName">Название</Label>
              <Input
                id="consultationName"
                value={newConsultationName}
                onChange={(e) => setNewConsultationName(e.target.value)}
                placeholder="Например: Индивидуальная консультация"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consultationDuration">Длительность (минуты)</Label>
                <Input
                  id="consultationDuration"
                  type="number"
                  value={newConsultationDuration}
                  onChange={(e) => setNewConsultationDuration(e.target.value)}
                  min={15}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consultationPrice">Цена (₽)</Label>
                <Input
                  id="consultationPrice"
                  type="number"
                  value={newConsultationPrice}
                  onChange={(e) => setNewConsultationPrice(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="consultationDescription">Описание (необязательно)</Label>
              <Textarea
                id="consultationDescription"
                value={newConsultationDescription}
                onChange={(e) => setNewConsultationDescription(e.target.value)}
                placeholder="Опишите особенности этого типа консультации"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConsultationTypeDialogOpen(false)}
            >
              Отменить
            </Button>
            <Button onClick={handleSaveConsultationType}>
              {editingConsultationType ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
