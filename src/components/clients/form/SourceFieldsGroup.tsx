
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema/clientFormSchema";

interface SourceFieldsGroupProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function SourceFieldsGroup({ form }: SourceFieldsGroupProps) {
  const sourceOptions = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "vk", label: "ВКонтакте" },
    { value: "referral", label: "Рекомендация" },
    { value: "search", label: "Поиск в интернете" },
    { value: "other", label: "Другое" },
  ];

  const communicationOptions = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telegram", label: "Telegram" },
    { value: "viber", label: "Viber" },
    { value: "vk", label: "ВКонтакте" },
    { value: "offline", label: "Офлайн" },
    { value: "other", label: "Другое" },
  ];

  return (
    <>
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
    </>
  );
}
