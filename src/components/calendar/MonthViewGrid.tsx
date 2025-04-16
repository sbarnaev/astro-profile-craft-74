
import React from "react";
import { MonthViewDayCell } from "./MonthViewDayCell";
import { AppointmentInterface } from "@/types/calendar";

interface MonthViewGridProps {
  weeks: (Date | null)[][];
  currentDate: Date;
  appointments: AppointmentInterface[];
  onAppointmentClick: (id: number) => void;
  onAddAppointment: (date: Date) => void;
}

export function MonthViewGrid({
  weeks,
  currentDate,
  appointments,
  onAppointmentClick,
  onAddAppointment
}: MonthViewGridProps) {
  return (
    <div className="space-y-1">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-1">
          {week.map((day, dayIndex) => (
            <MonthViewDayCell
              key={dayIndex}
              day={day}
              currentDate={currentDate}
              appointments={appointments}
              onAppointmentClick={onAppointmentClick}
              onAddAppointment={onAddAppointment}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
