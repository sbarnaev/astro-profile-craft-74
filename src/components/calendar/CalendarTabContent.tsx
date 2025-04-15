
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
}

export function CalendarTabContent({
  selectedTab,
  date,
  currentWeek,
  appointments,
  workHours,
  filteredAppointments,
  selectedAppointment,
  setSelectedAppointment,
  handleDateSelect,
  handleAddAppointment,
  goToPrevWeek,
  goToNextWeek
}: CalendarTabContentProps) {
  // Render appropriate view based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "day":
        return (
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
        );
        
      case "week":
        return (
          <CalendarWeek
            currentWeek={currentWeek}
            appointments={appointments}
            workHours={workHours}
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
            appointments={appointments}
            onAppointmentClick={(id) => setSelectedAppointment(id)}
            onAddAppointment={handleAddAppointment}
          />
        );
    }
  };

  return renderContent();
}
