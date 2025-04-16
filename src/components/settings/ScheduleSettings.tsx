
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Copy, Calendar as CalendarIcon, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useScheduleManagement, WorkSchedule } from "@/hooks/useScheduleManagement";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

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
    saveSettings,
  } = useScheduleManagement();
  
  // Локальное состояние для ввода перерыва
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [breakStartTime, setBreakStartTime] = useState<string>("12:00");
  const [breakEndTime, setBreakEndTime] = useState<string>("13:00");
  const [breakReason, setBreakReason] = useState<string>("Обеденный перерыв");
  
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
    const bookingURL = `${window.location.origin}/booking/${settings.bookingLink}`;
    navigator.clipboard.writeText(bookingURL);
    toast.success("Ссылка скопирована в буфер обмена", {
      description: bookingURL,
    });
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
          
          {/* Ссылка для записи */}
          <div className="space-y-4 pt-4">
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
        </CardContent>
      </Card>
      
      {/* Управление перерывами */}
      <Card className="border-none">
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
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
}
