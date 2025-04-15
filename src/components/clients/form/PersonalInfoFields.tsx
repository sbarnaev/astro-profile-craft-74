
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/clientFormSchema";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  phoneValue: string;
}

export function PersonalInfoFields({ form, handlePhoneChange, phoneValue }: PersonalInfoFieldsProps) {
  return (
    <>
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
        name="phone"
        render={() => (
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
    </>
  );
}
