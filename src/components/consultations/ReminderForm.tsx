
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reminderFormSchema = z.object({
  date: z.date({
    required_error: "Пожалуйста, выберите дату",
  }),
  time: z.string({
    required_error: "Пожалуйста, выберите время"
  }),
  text: z.string({
    required_error: "Пожалуйста, введите текст напоминания",
  }).min(5, {
    message: "Текст должен содержать не менее 5 символов",
  }),
  priority: z.string().default("medium"),
});

export interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  consultationId?: number;
}

export function ReminderForm({
  isOpen,
  onClose,
  onSubmit,
  consultationId
}: ReminderFormProps) {
  // Генерация временных слотов
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Создаем форму
  const form = useForm<z.infer<typeof reminderFormSchema>>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      date: new Date(),
      time: "09:00",
      text: "",
      priority: "medium"
    },
  });

  // Обработчик отправки формы
  const handleFormSubmit = (values: z.infer<typeof reminderFormSchema>) => {
    // Добавляем ID консультации, если он передан
    const reminderData = {
      ...values,
      consultationId,
      completed: false
    };
    
    onSubmit(reminderData);
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата напоминания</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "d MMMM yyyy", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={ru}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Время напоминания</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Приоритет</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите приоритет" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текст напоминания</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Введите текст напоминания..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
}
