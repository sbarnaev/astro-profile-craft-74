import React, { useState } from "react";
import { format, isToday, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentDrawer } from "./AppointmentDrawer";
import { AppointmentInterface } from "@/types/calendar";

interface WeekViewCellProps {
  day: Date;
  hour: number;
  appointments: AppointmentInterface[];
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
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  
  const handleAddAppointmentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddForm(true);
  };

  const initialTime = `${hour}:00`;

  // Get the selected appointment details
  const getAppointmentById = (id: number) => {
    return appointments.find(appointment => appointment.id === id);
  };
  
  return (
    <div 
      className={cn(
        "border-b border-r min-h-[60px] relative transition-colors",
        isToday(day) ? 'bg-primary/5' : '',
        isPast ? 'bg-gray-100 text-gray-500' : '',
        isWeekend ? 'bg-secondary/10' : '',
        isHoliday ? 'bg-purple-100' : '',
        isHovered && !isPast ? 'bg-accent/30' : '',
        isHovered && isPast ? 'bg-gray-200' : ''
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
              className={cn(
                "text-xs p-1 rounded mb-1 cursor-pointer truncate transition-colors",
                isPast ? "bg-gray-200 text-gray-600" : "bg-primary/20 text-primary-foreground hover:bg-primary/30"
              )}
              style={{
                height: `${Math.min(appointment.duration / 15, 4) * 15}px`,
                overflow: 'hidden'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAppointment(appointment.id);
                onAppointmentClick(appointment.id);
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium">{format(appointment.date, "HH:mm")} - {appointment.clientName}</span>
                {appointment.request && (
                  <span className="text-xs truncate opacity-80">{appointment.request}</span>
                )}
                {appointment.cost && (
                  <span className="text-xs font-medium">{appointment.cost.toLocaleString('ru-RU')} ₽</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center cursor-pointer",
                isPast ? "bg-gray-200 text-gray-500 hover:bg-gray-300" : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={handleAddAppointmentClick}
            >
              <Plus className="w-4 h-4" />
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

      {selectedAppointment && getAppointmentById(selectedAppointment) && (
        <AppointmentDrawer
          appointment={getAppointmentById(selectedAppointment)!}
          isOpen={selectedAppointment !== null}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
