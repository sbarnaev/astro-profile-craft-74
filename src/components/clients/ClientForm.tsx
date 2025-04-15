
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculatePersonalityCodes } from "@/lib/calculations";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать минимум 2 символа" }),
  patronymic: z.string().optional(),
  dob: z.date({ required_error: "Необходимо указать дату рождения" }),
  phone: z.string().regex(phoneRegex, { message: "Неверный формат телефона. Пример: +7 (900) 123-45-67" }),
  email: z.string().email({ message: "Неверный формат email" }).optional().or(z.literal("")),
  source: z.string().min(1, { message: "Укажите источник" }),
  communicationChannel: z.string().min(1, { message: "Укажите канал общения" }),
  personalityCode: z.number().optional(),
  connectorCode: z.number().optional(),
  realizationCode: z.number().optional(),
  generatorCode: z.number().optional(),
  missionCode: z.string().or(z.number()).optional(),
});

interface ClientFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: Partial<z.infer<typeof formSchema>>;
  showCodes?: boolean;
}

export function ClientForm({ onSubmit, initialData, showCodes = true }: ClientFormProps) {
  const [phoneValue, setPhoneValue] = useState(initialData?.phone || "");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      patronymic: initialData?.patronymic || "",
      dob: initialData?.dob,
      email: initialData?.email || "",
      source: initialData?.source || "",
      communicationChannel: initialData?.communicationChannel || "",
      personalityCode: initialData?.personalityCode,
      connectorCode: initialData?.connectorCode,
      realizationCode: initialData?.realizationCode,
      generatorCode: initialData?.generatorCode,
      missionCode: initialData?.missionCode,
    },
  });
  
  // Автоматический расчёт кодов при изменении даты рождения
  useEffect(() => {
    const date = form.watch("dob");
    if (date) {
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const codes = calculatePersonalityCodes(formattedDate);
        
        form.setValue("personalityCode", codes.personalityCode);
        form.setValue("connectorCode", codes.connectorCode);
        form.setValue("realizationCode", codes.realizationCode);
        form.setValue("generatorCode", codes.generatorCode);
        form.setValue("missionCode", codes.missionCode);
      } catch (error) {
        console.error("Ошибка расчета кодов:", error);
      }
    }
  }, [form.watch("dob")]);
  
  // Форматирование номера телефона в формат +7 (XXX) XXX-XX-XX
  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, "");
    
    if (!digits.length) return "";
    
    // Форматируем по частям
    let formattedPhone = "+7 ";
    
    if (digits.length > 0) {
      formattedPhone += "(" + digits.substring(1, Math.min(4, digits.length));
    }
    
    if (digits.length > 4) {
      formattedPhone += ") " + digits.substring(4, Math.min(7, digits.length));
    }
    
    if (digits.length > 7) {
      formattedPhone += "-" + digits.substring(7, Math.min(9, digits.length));
    }
    
    if (digits.length > 9) {
      formattedPhone += "-" + digits.substring(9, Math.min(11, digits.length));
    }
    
    return formattedPhone;
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setPhoneValue(formattedValue);
    form.setValue("phone", formattedValue, { shouldValidate: true });
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  const communicationOptions = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telegram", label: "Telegram" },
    { value: "viber", label: "Viber" },
    { value: "vk", label: "ВКонтакте" },
    { value: "offline", label: "Офлайн" },
    { value: "other", label: "Другое" },
  ];

  const sourceOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "vk", label: "ВКонтакте" },
    { value: "referral", label: "Рекомендация" },
    { value: "search", label: "Поиск в интернете" },
    { value: "other", label: "Другое" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фамилия</FormLabel>
              <FormControl>
                <Input placeholder="Введите фамилию" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="patronymic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Отчество</FormLabel>
              <FormControl>
                <Input placeholder="Введите отчество (если есть)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дата рождения</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1920-01-01")
                    }
                    initialFocus
                    locale={ru}
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+7 (900) 123-45-67" 
                  value={phoneValue}
                  onChange={handlePhoneChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Источник</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Откуда узнал клиент" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sourceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
          name="communicationChannel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Канал общения</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите канал общения" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {communicationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {showCodes && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Коды</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="personalityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код личности</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="connectorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код коннектора</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="realizationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код реализации</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="generatorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код генератора</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="missionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код миссии</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
}
