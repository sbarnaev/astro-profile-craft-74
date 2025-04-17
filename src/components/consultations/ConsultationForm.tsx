
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ClientInfoSection } from "./form/ClientInfoSection";
import { DatePickerField } from "./form/DatePickerField";
import { TimePickerField } from "./form/TimePickerField";
import { DurationField } from "./form/DurationField";
import { ConsultationTypeField } from "./form/ConsultationTypeField";
import { FormatField } from "./form/FormatField";
import { TextAreaField } from "./form/TextAreaFields";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  consultationFormSchema, 
  type ConsultationFormValues 
} from "./form/consultationFormSchema";
import { useAuth } from "@/context/AuthContext";

interface ConsultationFormProps {
  client?: any;
  onSubmit: (values: ConsultationFormValues) => void;
}

export function ConsultationForm({ client, onSubmit }: ConsultationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
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
      if (!user) {
        toast.error("Вы не авторизованы");
        return;
      }
      
      setIsSubmitting(true);
      
      const consultationData = {
        client_id: client?.id,
        date: values.date?.toISOString().split('T')[0],
        time: values.time,
        duration: values.duration,
        type: values.type,
        format: values.format,
        request: values.request,
        notes: values.notes || "",
        user_id: user.id,
        status: "scheduled"
      };
      
      console.log("Отправка данных в Supabase:", consultationData);
      
      const { data, error } = await supabase
        .from('consultations')
        .insert(consultationData)
        .select()
        .single();
      
      if (error) {
        console.error("Ошибка при создании сессии:", error);
        toast.error("Произошла ошибка при записи на сессию");
        return;
      }
      
      console.log("Полученный ответ от Supabase:", data);
      
      toast.success("Сессия успешно запланирована");
      
      // Transform Supabase response to match ConsultationFormValues format
      const formattedData: ConsultationFormValues = {
        id: data.id,
        clientId: client?.id,
        date: new Date(data.date),
        time: data.time,
        duration: data.duration,
        type: data.type,
        format: data.format as "video" | "in-person",
        request: data.request,
        notes: data.notes || ""
      };
      
      // Pass the properly formatted data to onSubmit
      onSubmit(formattedData);
      
    } catch (error) {
      console.error("Ошибка при создании сессии:", error);
      toast.error("Произошла ошибка при записи на сессию");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {client && <ClientInfoSection client={client} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField />
            <TimePickerField />
            <DurationField />
            <ConsultationTypeField />
            <FormatField />
          </div>

          <TextAreaField 
            name="request" 
            label="Запрос клиента" 
            placeholder="Опишите запрос клиента..." 
            required={true}
            minHeight="80px" 
          />

          <TextAreaField 
            name="notes" 
            label="Заметки (необязательно)" 
            placeholder="Дополнительная информация..." 
            minHeight="60px" 
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Записать на сессию"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
