
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

export interface ConsultationType {
  id: number;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface ScheduleSettings {
  workSchedule: WorkSchedule;
  appointmentDuration: number;
  breakBetweenAppointments: number;
  bookingLinkEnabled: boolean;
  bookingLink: string;
  breaks: BreakPeriod[];
  consultationTypes: ConsultationType[];
  paymentMethods: PaymentMethod[];
  autoConfirmBookings: boolean;
  notificationEmail: string;
  cancellationPolicy: string;
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
  consultationTypes: [
    { id: 1, name: "Индивидуальная консультация", duration: 60, price: 3500, description: "Стандартная консультация длительностью 1 час" },
    { id: 2, name: "Семейная консультация", duration: 90, price: 5000, description: "Расширенная консультация для пар и семей" },
    { id: 3, name: "Экспресс-консультация", duration: 30, price: 1500, description: "Короткая консультация по конкретному вопросу" },
  ],
  paymentMethods: [
    { id: "online", name: "Онлайн-оплата", description: "Оплата банковской картой через интернет", enabled: true },
    { id: "office", name: "Оплата при встрече", description: "Оплата наличными или картой при встрече", enabled: true },
  ],
  autoConfirmBookings: false,
  notificationEmail: "",
  cancellationPolicy: "Отмена записи возможна не менее чем за 24 часа до начала консультации. В противном случае оплата не возвращается.",
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
          
          // Добавляем новые поля, если они отсутствуют в сохраненных настройках
          if (!parsedSettings.consultationTypes) {
            parsedSettings.consultationTypes = defaultScheduleSettings.consultationTypes;
          }
          
          if (!parsedSettings.paymentMethods) {
            parsedSettings.paymentMethods = defaultScheduleSettings.paymentMethods;
          }
          
          if (parsedSettings.autoConfirmBookings === undefined) {
            parsedSettings.autoConfirmBookings = defaultScheduleSettings.autoConfirmBookings;
          }
          
          if (!parsedSettings.notificationEmail) {
            parsedSettings.notificationEmail = defaultScheduleSettings.notificationEmail;
          }
          
          if (!parsedSettings.cancellationPolicy) {
            parsedSettings.cancellationPolicy = defaultScheduleSettings.cancellationPolicy;
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
  
  // Добавление типа консультации
  const addConsultationType = (type: Omit<ConsultationType, "id">) => {
    // Находим максимальный ID и добавляем 1
    const maxId = Math.max(0, ...settings.consultationTypes.map(t => t.id));
    const newType: ConsultationType = {
      ...type,
      id: maxId + 1,
    };
    
    setSettings(prev => ({
      ...prev,
      consultationTypes: [...prev.consultationTypes, newType],
    }));
  };
  
  // Обновление типа консультации
  const updateConsultationType = (id: number, type: Partial<ConsultationType>) => {
    setSettings(prev => ({
      ...prev,
      consultationTypes: prev.consultationTypes.map(t => 
        t.id === id ? { ...t, ...type } : t
      ),
    }));
  };
  
  // Удаление типа консультации
  const removeConsultationType = (id: number) => {
    setSettings(prev => ({
      ...prev,
      consultationTypes: prev.consultationTypes.filter(t => t.id !== id),
    }));
  };
  
  // Обновление статуса метода оплаты
  const updatePaymentMethodEnabled = (id: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(m => 
        m.id === id ? { ...m, enabled } : m
      ),
    }));
  };
  
  // Обновление автоматического подтверждения записей
  const updateAutoConfirmBookings = (autoConfirm: boolean) => {
    setSettings(prev => ({
      ...prev,
      autoConfirmBookings: autoConfirm,
    }));
  };
  
  // Обновление email для уведомлений
  const updateNotificationEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      notificationEmail: email,
    }));
  };
  
  // Обновление политики отмены
  const updateCancellationPolicy = (policy: string) => {
    setSettings(prev => ({
      ...prev,
      cancellationPolicy: policy,
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
  
  // Получение полной ссылки для бронирования
  const getBookingUrl = () => {
    return `${window.location.origin}/booking/${settings.bookingLink}`;
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
    addConsultationType,
    updateConsultationType,
    removeConsultationType,
    updatePaymentMethodEnabled,
    updateAutoConfirmBookings,
    updateNotificationEmail,
    updateCancellationPolicy,
    saveSettings,
    getBookingUrl,
  };
}
