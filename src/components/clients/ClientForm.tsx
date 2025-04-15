
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { calculatePersonalityCodes } from "@/lib/calculations";
import { format } from "date-fns";

import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { DateOfBirthField } from "./form/DateOfBirthField";
import { SourceFieldsGroup } from "./form/SourceFieldsGroup";
import { PersonalityCodesFields } from "./form/PersonalityCodesFields";
import { formatPhoneNumber } from "./utils/phoneFormatter";
import { formSchema, ClientFormValues } from "./schema/clientFormSchema";

interface ClientFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialData?: Partial<z.infer<typeof formSchema>>;
  showCodes?: boolean;
}

export function ClientForm({ onSubmit, initialData, showCodes = true }: ClientFormProps) {
  const [phoneValue, setPhoneValue] = useState(initialData?.phone || "");
  
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
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setPhoneValue(formattedValue);
    form.setValue("phone", formattedValue, { shouldValidate: true });
  };

  const handleSubmit = (values: ClientFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <PersonalInfoFields 
          form={form} 
          handlePhoneChange={handlePhoneChange} 
          phoneValue={phoneValue} 
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
