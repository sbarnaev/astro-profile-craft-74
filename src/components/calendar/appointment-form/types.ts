import { z } from "zod";

// Схема формы
export const formSchema = z.object({
  clientId: z.number().optional(),
  consultationType: z.number({
    required_error: "Выберите тип консультации",
  }),
  date: z.date({
    required_error: "Выберите дату консультации",
  }),
  time: z.string({
    required_error: "Выберите время консультации",
  }),
  request: z.string().optional(),
  cost: z.number().optional(),
});

export type AppointmentFormValues = z.infer<typeof formSchema>;

// Пример данных о клиентах
export const clientsData = [
  { id: 1, firstName: "Анна", lastName: "Смирнова", patronymic: "Ивановна" },
  { id: 2, firstName: "Иван", lastName: "Петров", patronymic: "Сергеевич" },
  { id: 3, firstName: "Мария", lastName: "Иванова", patronymic: "Александровна" },
  { id: 4, firstName: "Александр", lastName: "Козлов", patronymic: "Дмитриевич" },
  { id: 5, firstName: "Екатерина", lastName: "Новикова", patronymic: "Андреевна" },
];

// Типы консультаций
export const consultationTypes = [
  { id: 1, name: "Экспресс-консультация", duration: 30, cost: 2000 },
  { id: 2, name: "Базовый анализ", duration: 60, cost: 3500 },
  { id: 3, name: "Отношения", duration: 90, cost: 5000 },
  { id: 4, name: "Целевой анализ", duration: 120, cost: 7000 },
];

export interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: string;
  onSubmit: (values: any) => void;
  initialClient?: any; // Add the initialClient property
  isEditing?: boolean;
  editData?: {
    cost?: number;
    request?: string;
    consultationType?: number;
  };
}
