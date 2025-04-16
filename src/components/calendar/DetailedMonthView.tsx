
import React, { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { AppointmentInterface } from "@/types/calendar";
import { MonthViewHeader } from "./MonthViewHeader";
import { MonthViewGrid } from "./MonthViewGrid";
import { calculateCalendarDays, russianDaysOfWeek } from "./utils/calendarCalculations";

interface DetailedMonthViewProps {
  currentDate: Date;
  appointments: AppointmentInterface[];
  onAppointmentClick: (id: number) => void;
  onAddAppointment: (data: any) => void;
}

export function DetailedMonthView({
  currentDate,
  appointments,
  onAppointmentClick,
  onAddAppointment
}: DetailedMonthViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  
  // Calculate the calendar days and weeks
  const { weeks } = calculateCalendarDays(currentDate);
  
  // Get appointment by ID
  const getAppointmentById = (id: number) => {
    return appointments.find(appointment => appointment.id === id);
  };
  
  // Handle appointment click
  const handleAppointmentClick = (id: number) => {
    setSelectedAppointment(id);
    onAppointmentClick(id);
  };
  
  // Handle add appointment
  const handleAddAppointment = (day: Date) => {
    setSelectedDate(day);
    setShowAddForm(true);
  };
  
  return (
    <Card className="astro-card border-none">
      <CardHeader className="pb-2">
        <CardTitle>
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MonthViewHeader daysOfWeek={russianDaysOfWeek} />
        
        <MonthViewGrid
          weeks={weeks}
          currentDate={currentDate}
          appointments={appointments}
          onAppointmentClick={handleAppointmentClick}
          onAddAppointment={handleAddAppointment}
        />
        
        {showAddForm && selectedDate && (
          <AppointmentForm 
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            initialDate={selectedDate}
            onSubmit={onAddAppointment}
          />
        )}
        
        {selectedAppointment && getAppointmentById(selectedAppointment) && (
          <AppointmentDrawer
            appointment={getAppointmentById(selectedAppointment)!}
            isOpen={selectedAppointment !== null}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
