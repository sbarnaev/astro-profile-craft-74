
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
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

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать минимум 2 символа" }),
  patronymic: z.string().optional(),
  dob: z.date({ required_error: "Необходимо указать дату рождения" }),
  phone: z.string().regex(phoneRegex, { message: "Неверный формат телефона. Пример: +7 (900) 123-45-67" }),
  email: z.string().email({ message: "Неверный формат email" }).optional().or(z.literal("")),
});

interface ClientFormProps {
  onSubmit: () => void;
  initialData?: z.infer<typeof formSchema>;
}

export function ClientForm({ onSubmit, initialData }: ClientFormProps) {
  const [phoneValue, setPhoneValue] = useState(initialData?.phone || "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      patronymic: "",
      email: "",
    },
  });
  
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
    console.log(values);
    onSubmit();
  };

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
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
}
