
import React, { useState } from "react";
import { format, isToday, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentForm } from "./AppointmentForm";

interface Appointment {
  id: number;
  clientName: string;
  clientId: number;
  date: Date;
  duration: number;
  type: string;
  request: string;
}

interface WeekViewCellProps {
  day: Date;
  hour: number;
  appointments: Appointment[];
  onAppointmentClick: (id: number) => void;
  onAddAppointment: (data: any) => void;
  isPast?: boolean;
  isWeekend?: boolean;
  isHoliday?: boolean;
}

export function WeekViewCell({
  day,
  hour,
  appointments,
  onAppointmentClick,
  onAddAppointment,
  isPast = false,
  isWeekend = false,
  isHoliday = false
}: WeekViewCellProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddAppointmentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddForm(true);
  };

  const initialTime = `${hour}:00`;
  
  return (
    <div 
      className={cn(
        "border-b border-r min-h-[60px] relative transition-colors",
        isToday(day) ? 'bg-primary/5' : '',
        isPast ? 'bg-gray-100' : '',
        isWeekend ? 'bg-secondary/10' : '',
        isHoliday ? 'bg-purple-100' : '',
        isHovered && 'bg-accent/30'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleAddAppointmentClick}
    >
      {appointments.length > 0 ? (
        <div className="absolute inset-0 p-1">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="text-xs p-1 rounded bg-primary/20 text-primary-foreground mb-1 cursor-pointer truncate hover:bg-primary/30 transition-colors"
              style={{
                height: `${Math.min(appointment.duration / 15, 4) * 15}px`,
                overflow: 'hidden'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAppointmentClick(appointment.id);
              }}
            >
              {format(appointment.date, "HH:mm")} - {appointment.clientName}
            </div>
          ))}
        </div>
      ) : (
        isHovered && !isPast && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20"
              onClick={handleAddAppointmentClick}
            >
              <Plus className="w-4 h-4 text-primary" />
            </div>
          </div>
        )
      )}
      
      <AppointmentForm 
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        initialDate={day}
        initialTime={initialTime}
        onSubmit={onAddAppointment}
      />
    </div>
  );
}
