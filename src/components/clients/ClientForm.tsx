import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { calculatePersonalityCodes } from "@/lib/calculations";
import { format } from "date-fns";
import { toast } from "sonner";

import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { DateOfBirthField } from "./form/DateOfBirthField";
import { SourceFieldsGroup } from "./form/SourceFieldsGroup";
import { PersonalityCodesFields } from "./form/PersonalityCodesFields";
import { formatPhoneNumber } from "./utils/phoneFormatter";
import { formSchema, ClientFormValues } from "./schema/clientFormSchema";

interface ClientFormProps {
  onSubmit: (data: z.infer<typeof formSchema>, analysis?: any) => void;
  initialData?: Partial<z.infer<typeof formSchema>>;
  showCodes?: boolean;
  generateAnalysis?: boolean;
  redirectAfterSubmit?: boolean;
}

export function ClientForm({ 
  onSubmit, 
  initialData, 
  showCodes = true,
  generateAnalysis = true,
  redirectAfterSubmit = false
}: ClientFormProps) {
  const [phoneValue, setPhoneValue] = useState(initialData?.phone?.replace(/^\+\d+\s/, "") || "");
  const [countryCode, setCountryCode] = useState(
    initialData?.phone?.match(/^\+\d+/)?.toString() || "+7"
  );
  const navigate = useNavigate();
  
  const form = useForm<ClientFormValues>({
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
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value, countryCode);
    setPhoneValue(formattedValue);
    form.setValue("phone", `${countryCode} ${formattedValue}`, { shouldValidate: true });
  };

  const handleSubmit = (values: ClientFormValues) => {
    const newClientId = Math.floor(Math.random() * 10000) + 100;
    
    const clientDataWithId = {
      ...values,
      id: newClientId
    };
    
    if (generateAnalysis) {
      const analysisData = {
        id: Math.floor(Math.random() * 10000),
        clientId: newClientId,
        clientName: `${values.lastName} ${values.firstName} ${values.patronymic || ""}`,
        clientPhone: values.phone,
        clientDob: values.dob,
        date: new Date(),
        type: "full",
        status: "completed",
        title: "Полный анализ личности",
        codes: {
          personality: values.personalityCode,
          connector: values.connectorCode,
          implementation: values.realizationCode,
          generator: values.generatorCode,
          mission: values.missionCode
        }
      };
      
      toast.success("Анализ личности создан автоматически", {
        description: "Анализ был создан на основе данных клиента"
      });
      
      onSubmit(clientDataWithId, analysisData);
    } else {
      onSubmit(clientDataWithId);
    }
    
    if (redirectAfterSubmit) {
      toast.success("Клиент успешно добавлен", {
        description: "Перенаправление на карточку клиента..."
      });
      
      const newClient = {
        id: newClientId,
        name: `${values.lastName} ${values.firstName} ${values.patronymic || ""}`.trim(),
        date: values.dob ? new Intl.DateTimeFormat('ru-RU').format(values.dob) : "",
        phone: values.phone,
        analysisCount: generateAnalysis ? 1 : 0,
        lastAnalysis: generateAnalysis ? new Intl.DateTimeFormat('ru-RU').format(new Date()) : "",
        source: values.source,
        communicationChannel: values.communicationChannel
      };
      
      navigate(`/clients/${newClientId}`, { 
        state: { newClient }
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <PersonalInfoFields 
          form={form} 
          handlePhoneChange={handlePhoneChange} 
          phoneValue={phoneValue}
          countryCode={countryCode}
          setCountryCode={(code) => {
            setCountryCode(code);
            form.setValue("phone", `${code} ${phoneValue}`, { shouldValidate: true });
          }}
        />
        
        <DateOfBirthField form={form} />
        
        <SourceFieldsGroup form={form} />
        
        {showCodes && <PersonalityCodesFields form={form} />}
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );
}
