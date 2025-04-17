
import { z } from "zod";

export const consultationFormSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.union([z.number(), z.string()]).optional(),
  date: z.date({
    required_error: "Выберите дату консультации",
  }),
  time: z.string({
    required_error: "Выберите время консультации",
  }),
  duration: z.number({
    required_error: "Выберите продолжительность",
  }),
  type: z.string({
    required_error: "Выберите тип консультации",
  }),
  format: z.enum(["video", "in-person"], {
    required_error: "Выберите формат консультации",
  }),
  request: z.string().min(3, {
    message: "Опишите запрос клиента",
  }),
  notes: z.string().optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;
