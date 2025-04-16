
import { useState } from "react";
import { AppointmentInterface } from "@/types/calendar";
import { toast } from "sonner";

// Пример данных о встречах
const appointmentsData = [
  { 
    id: 1, 
    clientName: "Анна Смирнова", 
    clientId: 1,
    date: new Date(2025, 3, 15, 10, 0), 
    duration: 60, 
    type: "Консультация",
    request: "Вопросы по личностному росту",
    cost: 3500,
    status: "active" as const
  },
  { 
    id: 2, 
    clientName: "Иван Петров", 
    clientId: 2,
    date: new Date(2025, 3, 15, 13, 30), 
    duration: 90, 
    type: "Полный анализ",
    request: "Проблемы в карьере, поиск направления",
    cost: 5000,
    status: "active" as const
  },
  { 
    id: 3, 
    clientName: "Мария Иванова", 
    clientId: 3,
    date: new Date(2025, 3, 16, 11, 0), 
    duration: 45, 
    type: "Консультация",
    request: "Сложности в отношениях с партнером",
    cost: 2000,
    status: "active" as const
  },
  { 
    id: 4, 
    clientName: "Александр Козлов", 
    clientId: 4,
    date: new Date(2025, 3, 17, 15, 0), 
    duration: 60, 
    type: "Базовый анализ",
    request: "Поиск предназначения",
    cost: 3500,
    status: "active" as const
  },
  { 
    id: 5, 
    clientName: "Екатерина Новикова", 
    clientId: 5,
    date: new Date(2025, 3, 18, 12, 0), 
    duration: 60, 
    type: "Консультация",
    request: "Вопросы самореализации",
    cost: 3500,
    status: "active" as const
  },
  { 
    id: 6, 
    clientName: "Дмитрий Соколов", 
    clientId: 6,
    date: new Date(2025, 3, 19, 9, 30), 
    duration: 45, 
    type: "Консультация",
    request: "Финансовые вопросы",
    cost: 2000,
    status: "active" as const
  },
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentInterface[]>(appointmentsData);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  
  // Обработчик добавления новой встречи
  const handleAddAppointment = (data: any) => {
    console.log("Новая встреча:", data);
    
    // Validate that a client is selected
    if (!data.clientId) {
      toast.error("Невозможно создать встречу без выбора клиента");
      return;
    }
    
    // For example, we'll add an appointment to the list
    const newAppointment: AppointmentInterface = {
      id: appointments.length + 1,
      clientName: data.clientName,
      clientId: data.clientId, // This is now required
      date: data.appointmentDateTime || new Date(),
      duration: data.duration || 60,
      type: data.consultationType 
        ? ["Экспресс-консультация", "Базовый анализ", "Отношения", "Целевой анализ"][data.consultationType - 1] 
        : "Консультация", // Ensure type is always provided
      request: data.request || "",
      cost: data.cost || 3500,
      status: "active" as const
    };
    
    setAppointments([...appointments, newAppointment]);
    toast.success("Встреча успешно создана");
  };
  
  // Обработчик отмены встречи
  const handleCancelAppointment = (id: number) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id 
        ? { ...appointment, status: "cancelled" as const } 
        : appointment
    ));
    
    toast.success("Встреча отменена", {
      description: "Встреча была успешно отменена и сохранена в истории"
    });
    setSelectedAppointment(null);
  };
  
  // Получение встреч для конкретного дня
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      appointment.date.getDate() === day.getDate() && 
      appointment.date.getMonth() === day.getMonth() && 
      appointment.date.getFullYear() === day.getFullYear()
    );
  };
  
  // Получение деталей встречи по ID
  const getAppointmentById = (id: number) => {
    return appointments.find(appointment => appointment.id === id);
  };
  
  return {
    appointments,
    setAppointments,
    selectedAppointment,
    setSelectedAppointment,
    handleAddAppointment,
    handleCancelAppointment,
    getAppointmentsForDay,
    getAppointmentById
  };
}
