
import { z } from "zod";

export const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export const formSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать минимум 2 символа" }),
  patronymic: z.string().optional(),
  dob: z.date({ required_error: "Необходимо указать дату рождения" }),
  phone: z.string().regex(phoneRegex, { message: "Неверный формат телефона. Пример: +7 (900) 123-45-67" }),
  email: z.string().email({ message: "Неверный формат email" }).optional().or(z.literal("")),
  source: z.string().min(1, { message: "Укажите источник" }),
  communicationChannel: z.string().min(1, { message: "Укажите канал общения" }),
  personalityCode: z.number().nullable().optional(),
  connectorCode: z.number().nullable().optional(),
  realizationCode: z.number().nullable().optional(),
  generatorCode: z.number().nullable().optional(),
  missionCode: z.union([z.string(), z.number()]).nullable().optional(),
});

export type ClientFormValues = z.infer<typeof formSchema>;
