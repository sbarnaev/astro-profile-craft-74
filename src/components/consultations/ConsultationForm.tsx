import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const consultationTypes = [
  { id: "express", name: "Экспресс-консультация" },
  { id: "basic", name: "Базовая консультация" },
  { id: "relationship", name: "Консультация по отношениям" },
  { id: "targeted", name: "Целевая консультация" },
];

const timeSlots = Array.from({ length: 24 }).flatMap((_, hour) => 
  ["00", "30"].map(minutes => `${hour.toString().padStart(2, '0')}:${minutes}`)
);

const durations = [
  { value: 30, label: "30 минут" },
  { value: 60, label: "1 час" },
  { value: 90, label: "1.5 часа" },
  { value: 120, label: "2 часа" },
];

const consultationFormSchema = z.object({
  clientId: z.number().optional(),
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

type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

interface ConsultationFormProps {
  client?: any;
  onSubmit: (values: ConsultationFormValues) => void;
}

export function ConsultationForm({ client, onSubmit }: ConsultationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      clientId: client?.id,
      date: undefined,
      time: "",
      duration: 60,
      type: "",
      format: "video",
      request: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: ConsultationFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Call the onSubmit prop with the form values
      // This allows the parent component to handle the submission
      onSubmit(values);
      
    } catch (error) {
      console.error("Ошибка при создании консультации:", error);
      toast.error("Произошла ошибка при записи на консультацию");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatClientDob = (date: any) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }
    
    return format(dateObj, "d MMMM yyyy", { locale: ru });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {client && (
          <div className="p-4 border rounded-md bg-muted/30 mb-4">
            <h3 className="font-medium mb-2">Информация о клиенте</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">ФИО:</span>
                <span className="ml-2 font-medium">
                  {client.lastName} {client.firstName} {client.patronymic || ""}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Телефон:</span>
                <span className="ml-2 font-medium">{client.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Дата рождения:</span>
                <span className="ml-2 font-medium">
                  {formatClientDob(client.dob)}
                </span>
              </div>
              {client.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-2 font-medium">{client.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата консультации</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
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
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
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
                <FormLabel>Время начала</FormLabel>
                <div className="flex space-x-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px] overflow-y-auto z-50">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    className="w-28"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Продолжительность</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите продолжительность" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-50">
                    {durations.map((duration) => (
                      <SelectItem
                        key={duration.value}
                        value={duration.value.toString()}
                      >
                        {duration.label}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип консультации</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-50">
                    {consultationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
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
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Формат консультации</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите формат" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-50">
                    <SelectItem value="video">Видео-консультация</SelectItem>
                    <SelectItem value="in-person">Очная встреча</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="request"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Запрос клиента</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите запрос клиента..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заметки (необязательно)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Дополнительная информация..."
                  className="min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Создание..." : "Записать на консультацию"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
