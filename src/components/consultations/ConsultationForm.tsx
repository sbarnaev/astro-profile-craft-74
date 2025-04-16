
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
      
      // Подготовка данных для сохранения в базу данных
      const consultationData = {
        client_id: client?.id,
        date: values.date?.toISOString().split('T')[0],
        time: values.time,
        duration: values.duration,
        type: values.type,
        format: values.format,
        request: values.request,
        notes: values.notes || "",
        user_id: user.id
      };
      
      // Сохранение данных в Supabase
      const { data, error } = await supabase
        .from('consultations')
        .insert(consultationData)
        .select()
        .single();
      
      if (error) {
        console.error("Ошибка при создании консультации:", error);
        toast.error("Произошла ошибка при записи на консультацию");
        return;
      }
      
      toast.success("Консультация успешно запланирована");
      
      // Call the onSubmit prop with the form values and DB response
      onSubmit({...values, id: data.id});
      
    } catch (error) {
      console.error("Ошибка при создании консультации:", error);
      toast.error("Произошла ошибка при записи на консультацию");
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
              {isSubmitting ? "Создание..." : "Записать на консультацию"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
