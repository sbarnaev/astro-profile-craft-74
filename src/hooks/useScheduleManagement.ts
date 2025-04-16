
import { useState, useEffect } from "react";

export interface WorkingHours {
  start: string;
  end: string;
}

export interface WorkSchedule {
  monday: { enabled: boolean; hours: WorkingHours };
  tuesday: { enabled: boolean; hours: WorkingHours };
  wednesday: { enabled: boolean; hours: WorkingHours };
  thursday: { enabled: boolean; hours: WorkingHours };
  friday: { enabled: boolean; hours: WorkingHours };
  saturday: { enabled: boolean; hours: WorkingHours };
  sunday: { enabled: boolean; hours: WorkingHours };
}

export interface BreakPeriod {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface ScheduleSettings {
  workSchedule: WorkSchedule;
  appointmentDuration: number;
  breakBetweenAppointments: number;
  bookingLinkEnabled: boolean;
  bookingLink: string;
  breaks: BreakPeriod[];
}

// Начальные настройки графика работы
const defaultScheduleSettings: ScheduleSettings = {
  workSchedule: {
    monday: { enabled: true, hours: { start: "09:00", end: "18:00" } },
    tuesday: { enabled: true, hours: { start: "09:00", end: "18:00" } },
    wednesday: { enabled: true, hours: { start: "09:00", end: "18:00" } },
    thursday: { enabled: true, hours: { start: "09:00", end: "18:00" } },
    friday: { enabled: true, hours: { start: "09:00", end: "18:00" } },
    saturday: { enabled: false, hours: { start: "10:00", end: "15:00" } },
    sunday: { enabled: false, hours: { start: "10:00", end: "15:00" } },
  },
  appointmentDuration: 60,
  breakBetweenAppointments: 15,
  bookingLinkEnabled: true,
  bookingLink: "consultant",
  breaks: [],
};

export function useScheduleManagement() {
  const [settings, setSettings] = useState<ScheduleSettings>(defaultScheduleSettings);
  const [loading, setLoading] = useState(true);
  
  // Загрузка настроек при инициализации
  useEffect(() => {
    // Здесь будет логика загрузки настроек из хранилища или API
    // Для примера используем setTimeout для имитации асинхронной загрузки
    setTimeout(() => {
      // Проверяем, есть ли сохраненные настройки в localStorage
      const savedSettings = localStorage.getItem("scheduleSettings");
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          
          // Конвертируем строковые даты обратно в объекты Date
          if (parsedSettings.breaks && Array.isArray(parsedSettings.breaks)) {
            parsedSettings.breaks = parsedSettings.breaks.map((breakItem: any) => ({
              ...breakItem,
              date: new Date(breakItem.date),
            }));
          }
          
          setSettings(parsedSettings);
        } catch (error) {
          console.error("Ошибка при разборе сохраненных настроек:", error);
          setSettings(defaultScheduleSettings);
        }
      } else {
        setSettings(defaultScheduleSettings);
      }
      setLoading(false);
    }, 500);
  }, []);
  
  // Обновление настроек рабочего дня
  const updateWorkingDay = (day: keyof WorkSchedule, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        [day]: {
          ...prev.workSchedule[day],
          enabled,
        },
      },
    }));
  };
  
  // Обновление рабочих часов
  const updateWorkingHours = (day: keyof WorkSchedule, field: "start" | "end", value: string) => {
    setSettings(prev => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        [day]: {
          ...prev.workSchedule[day],
          hours: {
            ...prev.workSchedule[day].hours,
            [field]: value,
          },
        },
      },
    }));
  };
  
  // Обновление продолжительности консультации
  const updateAppointmentDuration = (duration: number) => {
    setSettings(prev => ({
      ...prev,
      appointmentDuration: duration,
    }));
  };
  
  // Обновление перерыва между консультациями
  const updateBreakBetweenAppointments = (breakTime: number) => {
    setSettings(prev => ({
      ...prev,
      breakBetweenAppointments: breakTime,
    }));
  };
  
  // Обновление статуса ссылки для записи
  const updateBookingLinkEnabled = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      bookingLinkEnabled: enabled,
    }));
  };
  
  // Обновление ссылки для записи
  const updateBookingLink = (link: string) => {
    setSettings(prev => ({
      ...prev,
      bookingLink: link,
    }));
  };
  
  // Добавление перерыва
  const addBreak = (breakPeriod: Omit<BreakPeriod, "id">) => {
    const newBreak: BreakPeriod = {
      ...breakPeriod,
      id: crypto.randomUUID(),
    };
    
    setSettings(prev => ({
      ...prev,
      breaks: [...prev.breaks, newBreak],
    }));
  };
  
  // Удаление перерыва
  const removeBreak = (id: string) => {
    setSettings(prev => ({
      ...prev,
      breaks: prev.breaks.filter(b => b.id !== id),
    }));
  };
  
  // Сохранение настроек
  const saveSettings = () => {
    try {
      localStorage.setItem("scheduleSettings", JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      return false;
    }
  };
  
  return {
    settings,
    loading,
    updateWorkingDay,
    updateWorkingHours,
    updateAppointmentDuration,
    updateBreakBetweenAppointments,
    updateBookingLinkEnabled,
    updateBookingLink,
    addBreak,
    removeBreak,
    saveSettings,
  };
}
