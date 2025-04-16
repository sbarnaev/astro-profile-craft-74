
import { z } from "zod";

// Схема валидации формы
export const formSchema = z.object({
  clientId: z.number().optional(),
  date: z.date(),
  time: z.string(),
  consultationType: z.number(),
  request: z.string().min(1, { message: "Введите запрос клиента" }),
  cost: z.number(),
});

// Тип значений формы
export type AppointmentFormValues = z.infer<typeof formSchema>;

// Пример данных о клиентах
export const clientsData = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Иванов",
    patronymic: "Иванович",
    phone: "+7 (999) 123-45-67",
    email: "ivan@example.com"
  },
  {
    id: 2,
    firstName: "Мария",
    lastName: "Петрова",
    patronymic: "Сергеевна",
    phone: "+7 (999) 765-43-21",
    email: "maria@example.com"
  },
  {
    id: 3,
    firstName: "Алексей",
    lastName: "Смирнов",
    patronymic: "Александрович",
    phone: "+7 (999) 111-22-33",
    email: "alex@example.com"
  }
];

// Типы консультаций
export const consultationTypes = [
  {
    id: 1,
    name: "Экспресс-консультация",
    duration: 60,
    cost: 3500
  },
  {
    id: 2,
    name: "Базовый анализ",
    duration: 90,
    cost: 5500
  },
  {
    id: 3,
    name: "Отношения",
    duration: 120,
    cost: 7500
  },
  {
    id: 4,
    name: "Целевой анализ",
    duration: 120,
    cost: 8500
  }
];

// Props для формы записи на прием
export interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: string;
  onSubmit: (values: any) => void;
  initialClient?: any;
  isEditing?: boolean;
  editData?: {
    cost?: number;
    request?: string;
    consultationType?: number;
  };
}
