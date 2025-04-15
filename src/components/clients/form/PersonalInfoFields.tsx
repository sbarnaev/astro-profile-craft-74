
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/clientFormSchema";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  phoneValue: string;
  countryCode: string;
  setCountryCode: (code: string) => void;
}

// Список популярных кодов стран для телефонных номеров
const countryCodes = [
  { code: "+7", country: "Россия" },
  { code: "+375", country: "Беларусь" },
  { code: "+380", country: "Украина" },
  { code: "+1", country: "США/Канада" },
  { code: "+44", country: "Великобритания" },
  { code: "+49", country: "Германия" },
  { code: "+33", country: "Франция" },
  { code: "+39", country: "Италия" },
  { code: "+34", country: "Испания" },
  { code: "+86", country: "Китай" },
  { code: "+91", country: "Индия" },
  { code: "+81", country: "Япония" },
];

export function PersonalInfoFields({ 
  form, 
  handlePhoneChange, 
  phoneValue, 
  countryCode, 
  setCountryCode 
}: PersonalInfoFieldsProps) {
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
            <div className="flex gap-2">
              <div className="w-1/4">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger>
                    <SelectValue placeholder={countryCode} />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <FormControl>
                  <Input
                    placeholder="(900) 123-45-67"
                    value={phoneValue}
                    onChange={handlePhoneChange}
                  />
                </FormControl>
              </div>
            </div>
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
