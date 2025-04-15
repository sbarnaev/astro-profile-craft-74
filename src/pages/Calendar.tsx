
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentForm } from "@/components/calendar/AppointmentForm";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useAppointments } from "@/hooks/useAppointments";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarTabContent } from "@/components/calendar/CalendarTabContent";

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
      <CalendarHeader onAddAppointment={() => setShowAddForm(true)} />

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
          <CalendarTabContent
            selectedTab={selectedTab}
            date={date}
            currentWeek={currentWeek}
            appointments={appointments}
            workHours={workHours}
            filteredAppointments={filteredAppointments}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            handleDateSelect={handleDateSelect}
            handleAddAppointment={handleAddAppointment}
            goToPrevWeek={goToPrevWeek}
            goToNextWeek={goToNextWeek}
          />
        </TabsContent>
        
        <TabsContent value="week">
          <CalendarTabContent
            selectedTab={selectedTab}
            date={date}
            currentWeek={currentWeek}
            appointments={appointments}
            workHours={workHours}
            filteredAppointments={filteredAppointments}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            handleDateSelect={handleDateSelect}
            handleAddAppointment={handleAddAppointment}
            goToPrevWeek={goToPrevWeek}
            goToNextWeek={goToNextWeek}
          />
        </TabsContent>
        
        <TabsContent value="month">
          <CalendarTabContent
            selectedTab={selectedTab}
            date={date}
            currentWeek={currentWeek}
            appointments={appointments}
            workHours={workHours}
            filteredAppointments={filteredAppointments}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
            handleDateSelect={handleDateSelect}
            handleAddAppointment={handleAddAppointment}
            goToPrevWeek={goToPrevWeek}
            goToNextWeek={goToNextWeek}
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
