
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentForm } from "@/components/calendar/AppointmentForm";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useAppointments } from "@/hooks/useAppointments";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarTabContent } from "@/components/calendar/CalendarTabContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Часы работы (с 9:00 до 19:00)
const workHours = Array.from({ length: 11 }, (_, i) => i + 9);

const Calendar = () => {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get("view") || "day";
  const clientId = searchParams.get("client");
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>(initialView);
  const [showAddForm, setShowAddForm] = useState(false);
  const [clientInfo, setClientInfo] = useState<any>(null);
  
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
    handleCancelAppointment,
    getAppointmentsForDay
  } = useAppointments();
  
  // Fetch client info if clientId is provided
  useEffect(() => {
    if (clientId) {
      const fetchClient = async () => {
        try {
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();
            
          if (error) {
            console.error("Error fetching client:", error);
            return;
          }
          
          if (data) {
            setClientInfo({
              id: parseInt(data.id),
              firstName: data.first_name,
              lastName: data.last_name,
              patronymic: data.patronymic || "",
              phone: data.phone,
              email: data.email || ""
            });
            
            // Automatically open appointment form if client is specified
            setShowAddForm(true);
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      };
      
      fetchClient();
    }
  }, [clientId]);
  
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
        
        <TabsContent value={selectedTab}>
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
            onCancelAppointment={handleCancelAppointment}
          />
        </TabsContent>
      </Tabs>
      
      <AppointmentForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        initialDate={date}
        onSubmit={handleAddAppointment}
        initialClient={clientInfo}
      />
    </div>
  );
};

export default Calendar;
