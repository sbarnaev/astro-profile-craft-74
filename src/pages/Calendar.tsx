
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { DetailedMonthView } from "@/components/calendar/DetailedMonthView";
import { AppointmentForm } from "@/components/calendar/AppointmentForm";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useAppointments } from "@/hooks/useAppointments";

// Часы работы (с 9:00 до 19:00)
const workHours = Array.from({ length: 11 }, (_, i) => i + 9);

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("day");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { 
    currentWeek, 
    setCurrentWeek, 
    goToPrevWeek, 
    goToNextWeek, 
    goToCurrentWeek 
  } = useCalendarNavigation();
  
  const {
    appointments,
    selectedAppointment,
    setSelectedAppointment,
    handleAddAppointment,
    getAppointmentsForDay
  } = useAppointments();
  
  // Фильтрация встреч на выбранную дату
  const filteredAppointments = date ? getAppointmentsForDay(date) : [];
  
  // Обработчик выбора даты
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setCurrentWeek(newDate);
      setSelectedTab("day");
    }
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
            <CalendarSidebar date={date} onDateSelect={handleDateSelect} />
            <CalendarDay
              date={date}
              appointments={filteredAppointments}
              onAddAppointment={handleAddAppointment}
              selectedAppointment={selectedAppointment}
              setSelectedAppointment={setSelectedAppointment}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="week">
          <CalendarWeek
            currentWeek={currentWeek}
            appointments={appointments}
            workHours={workHours}
            onAppointmentClick={(id) => setSelectedAppointment(id)}
            onAddAppointment={handleAddAppointment}
            goToPrevWeek={goToPrevWeek}
            goToNextWeek={goToNextWeek}
          />
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
