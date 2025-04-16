
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { parse, format } from "date-fns";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ClientSearchField } from "./ClientSearchField";
import { ConsultationTypeField } from "./ConsultationTypeField";
import { DateField } from "./DateField";
import { TimeField } from "./TimeField";
import { CostField } from "./CostField";
import { RequestField } from "./RequestField";
import { AppointmentFormValues, formSchema, clientsData, consultationTypes } from "./types";

interface ExistingClientFormProps {
  initialDate?: Date;
  initialTime?: string;
  onSubmit: (values: any) => void;
  onClose: () => void;
  onCreateNew: () => void;
  initialClient?: any;
}

export function ExistingClientForm({ 
  initialDate, 
  initialTime, 
  onSubmit, 
  onClose, 
  onCreateNew,
  initialClient
}: ExistingClientFormProps) {
  const [customCost, setCustomCost] = React.useState<number | null>(null);
  
  // Создаем форму с учетом режима редактирования
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialDate || new Date(),
      time: initialTime || "10:00",
      request: initialClient?.editData?.request || "",
      cost: initialClient?.editData?.cost || 3500,
      consultationType: initialClient?.editData?.consultationType || 1,
    },
  });
  
  // Set form values when initialClient is provided
  useEffect(() => {
    if (initialClient?.id) {
      form.setValue("clientId", initialClient.id);
    }
  }, [initialClient, form]);
  
  // Update cost when consultation type changes
  React.useEffect(() => {
    const typeId = form.getValues().consultationType;
    if (typeId) {
      const selectedType = consultationTypes.find(type => type.id === typeId);
      if (selectedType && !customCost) {
        form.setValue("cost", selectedType.cost);
      }
    }
  }, [form.watch("consultationType")]);
  
  // Обработка отправки формы
  const handleFormSubmit = (values: AppointmentFormValues) => {
    // Собираем полные данные для создания встречи
    const appointmentData = {
      ...values,
      // Преобразуем время и дату в объект Date
      appointmentDateTime: values.date
        ? parse(`${format(values.date, "yyyy-MM-dd")} ${values.time}`, "yyyy-MM-dd HH:mm", new Date())
        : null,
      duration: values.consultationType
        ? consultationTypes.find((type) => type.id === values.consultationType)?.duration || 60
        : 60,
      clientName: values.clientId
        ? `${clientsData.find((c) => c.id === values.clientId)?.lastName} ${
            clientsData.find((c) => c.id === values.clientId)?.firstName
          } ${clientsData.find((c) => c.id === values.clientId)?.patronymic}`
        : "Новый клиент",
      cost: values.cost || 3500
    };
    
    onSubmit(appointmentData);
    onClose();
  };
  
  const handleSelectClient = (clientId: number) => {
    form.setValue("clientId", clientId);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ClientSearchField 
          value={form.getValues().clientId} 
          onChange={handleSelectClient} 
          onCreateNew={onCreateNew} 
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ConsultationTypeField form={form} />
          <DateField form={form} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TimeField form={form} />
          <CostField form={form} onCustomCostChange={setCustomCost} />
        </div>
        
        <RequestField form={form} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={!form.getValues().clientId}>
            Создать встречу
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
