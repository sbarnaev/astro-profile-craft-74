
import React from "react";
import { AppointmentInterface } from "@/types/calendar";
import { CalendarSidebar } from "./CalendarSidebar";
import { CalendarDay } from "./CalendarDay";
import { CalendarWeek } from "./CalendarWeek";
import { DetailedMonthView } from "./DetailedMonthView";

interface CalendarTabContentProps {
  selectedTab: string;
  date: Date | undefined;
  currentWeek: Date;
  appointments: AppointmentInterface[];
  workHours: number[];
  filteredAppointments: AppointmentInterface[];
  selectedAppointment: number | null;
  setSelectedAppointment: (id: number | null) => void;
  handleDateSelect: (date: Date | undefined) => void;
  handleAddAppointment: (data: any) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  onCancelAppointment?: (id: number) => void;
}

export function CalendarTabContent({
  selectedTab,
  date,
  currentWeek,
  appointments = [],
  workHours = [],
  filteredAppointments = [],
  selectedAppointment,
  setSelectedAppointment,
  handleDateSelect,
  handleAddAppointment,
  goToPrevWeek,
  goToNextWeek,
  onCancelAppointment
}: CalendarTabContentProps) {
  // Make sure we always have arrays, even if undefined is passed
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeFilteredAppointments = Array.isArray(filteredAppointments) ? filteredAppointments : [];
  const safeWorkHours = Array.isArray(workHours) ? workHours : [];

  // Render appropriate view based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "day":
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <CalendarSidebar date={date} onDateSelect={handleDateSelect} />
            <CalendarDay
              date={date}
              appointments={safeFilteredAppointments}
              onAddAppointment={handleAddAppointment}
              selectedAppointment={selectedAppointment}
              setSelectedAppointment={setSelectedAppointment}
              onCancelAppointment={onCancelAppointment}
            />
          </div>
        );
        
      case "week":
        return (
          <CalendarWeek
            currentWeek={currentWeek}
            appointments={safeAppointments}
            workHours={safeWorkHours}
            onAppointmentClick={(id) => setSelectedAppointment(id)}
            onAddAppointment={handleAddAppointment}
            goToPrevWeek={goToPrevWeek}
            goToNextWeek={goToNextWeek}
          />
        );
        
      case "month":
      default:
        return (
          <DetailedMonthView
            currentDate={date || new Date()}
            appointments={safeAppointments}
            onAppointmentClick={(id) => setSelectedAppointment(id)}
            onAddAppointment={handleAddAppointment}
          />
        );
    }
  };

  return renderContent();
}
