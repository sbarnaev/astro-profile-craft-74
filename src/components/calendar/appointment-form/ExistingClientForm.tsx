
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
  isEditing?: boolean;
  editData?: {
    cost?: number;
    request?: string;
    consultationType?: number;
  };
}

export function ExistingClientForm({ 
  initialDate, 
  initialTime, 
  onSubmit, 
  onClose, 
  onCreateNew,
  initialClient,
  isEditing = false,
  editData
}: ExistingClientFormProps) {
  const [customCost, setCustomCost] = React.useState<number | null>(null);
  
  // Make sure consultationTypes is always an array
  const safeConsultationTypes = Array.isArray(consultationTypes) ? consultationTypes : [];
  
  // Create form with default values accounting for edit mode
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialClient?.id || undefined,
      date: initialDate || new Date(),
      time: initialTime || "10:00",
      request: editData?.request || "",
      cost: editData?.cost || 3500,
      consultationType: editData?.consultationType || 1,
    },
  });
  
  // Set form values when initialClient is provided
  useEffect(() => {
    if (initialClient?.id) {
      form.setValue("clientId", initialClient.id);
      console.log("Setting initial client ID:", initialClient.id);
    }
  }, [initialClient, form]);
  
  // Update cost when consultation type changes
  React.useEffect(() => {
    const typeId = form.getValues().consultationType;
    if (typeId && safeConsultationTypes.length > 0) {
      const selectedType = safeConsultationTypes.find(type => type.id === typeId);
      if (selectedType && !customCost) {
        form.setValue("cost", selectedType.cost);
      }
    }
  }, [form.watch("consultationType")]);
  
  // Set default client if initialClient is provided and no clientId has been set yet
  React.useEffect(() => {
    const currentClientId = form.getValues().clientId;
    
    if (initialClient?.id && !currentClientId) {
      form.setValue("clientId", initialClient.id);
    }
  }, [initialClient, form]);
  
  // Handle form submission
  const handleFormSubmit = (values: AppointmentFormValues) => {
    // Make sure clientId is set before submitting
    if (!values.clientId && initialClient?.id) {
      values.clientId = initialClient.id;
    }
    
    // Validate that a client is selected
    if (!values.clientId) {
      form.setError("clientId", {
        type: "manual",
        message: "Пожалуйста, выберите клиента"
      });
      return;
    }
    
    // Ensure clientsData is always an array
    const safeClientsData = Array.isArray(clientsData) ? clientsData : [];
    
    // Безопасный поиск клиента с проверкой на undefined
    const findClientSafely = (id: number) => {
      if (!Array.isArray(safeClientsData) || safeClientsData.length === 0) {
        return undefined;
      }
      return safeClientsData.find((c) => c && c.id === id);
    };
    
    // Безопасный поиск типа консультации с проверкой на undefined
    const findConsultationTypeSafely = (id: number) => {
      if (!Array.isArray(safeConsultationTypes) || safeConsultationTypes.length === 0) {
        return undefined;
      }
      return safeConsultationTypes.find((type) => type && type.id === id);
    };
    
    // Безопасно получаем данные клиента
    const client = values.clientId ? findClientSafely(values.clientId) : undefined;
    
    // Gather complete data for appointment creation
    const appointmentData = {
      ...values,
      // Convert time and date to Date object
      appointmentDateTime: values.date
        ? parse(`${format(values.date, "yyyy-MM-dd")} ${values.time || "00:00"}`, "yyyy-MM-dd HH:mm", new Date())
        : new Date(),
      duration: values.consultationType
        ? (findConsultationTypeSafely(values.consultationType)?.duration || 60)
        : 60,
      clientName: client
        ? `${client.lastName || ""} ${client.firstName || ""} ${client.patronymic || ""}`
        : "Новый клиент",
      cost: values.cost || 3500
    };
    
    onSubmit(appointmentData);
    onClose();
  };
  
  const handleSelectClient = (clientId: number) => {
    form.setValue("clientId", clientId);
    form.clearErrors("clientId");
  };
  
  // Find the current selected client ID for the ClientSearchField
  const currentClientId = form.getValues().clientId;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ClientSearchField 
          value={currentClientId} 
          onChange={handleSelectClient} 
          onCreateNew={onCreateNew} 
          isEditing={isEditing}
          required={true}
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
          <Button type="submit">
            {isEditing ? 'Сохранить изменения' : 'Создать встречу'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
