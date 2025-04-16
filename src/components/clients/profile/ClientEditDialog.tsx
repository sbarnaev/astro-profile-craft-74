
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ClientEditDialogProps {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    dob: Date;
    phone: string;
    email?: string;
    source: string;
    communicationChannel: string;
    personalityCode: number | null;
    connectorCode: number | null;
    realizationCode: number | null;
    generatorCode: number | null;
    missionCode: string | number | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const ClientEditDialog = ({ client, isOpen, onClose }: ClientEditDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClient = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('clients')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          patronymic: data.patronymic || null,
          dob: format(data.dob, 'yyyy-MM-dd'),
          phone: data.phone,
          email: data.email || null,
          source: data.source,
          communication_channel: data.communicationChannel,
          personality_code: data.personalityCode !== undefined && data.personalityCode !== null ? 
            Number(data.personalityCode) : null,
          connector_code: data.connectorCode !== undefined && data.connectorCode !== null ? 
            Number(data.connectorCode) : null,
          realization_code: data.realizationCode !== undefined && data.realizationCode !== null ? 
            Number(data.realizationCode) : null,
          generator_code: data.generatorCode !== undefined && data.generatorCode !== null ? 
            Number(data.generatorCode) : null,
          mission_code: data.missionCode !== undefined && data.missionCode !== null ? 
            String(data.missionCode) : null
        })
        .eq('id', client.id);
        
      if (error) {
        throw error;
      }
      
      onClose();
      toast.success("Данные клиента обновлены", {
        description: "Информация о клиенте была успешно обновлена."
      });
    } catch (error) {
      console.error("Ошибка при обновлении данных клиента:", error);
      toast.error("Не удалось обновить данные клиента", {
        description: "Пожалуйста, попробуйте еще раз или обратитесь к администратору."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Редактировать данные клиента</DialogTitle>
      </DialogHeader>
      <ClientForm 
        onSubmit={handleEditClient} 
        initialData={{ 
          firstName: client.firstName,
          lastName: client.lastName,
          patronymic: client.patronymic || "",
          dob: client.dob,
          phone: client.phone,
          email: client.email || "",
          source: client.source,
          communicationChannel: client.communicationChannel,
          personalityCode: client.personalityCode,
          connectorCode: client.connectorCode,
          realizationCode: client.realizationCode,
          generatorCode: client.generatorCode,
          missionCode: client.missionCode
        }}
        generateAnalysis={false}
        isSubmitting={isSubmitting}
      />
    </DialogContent>
  );
};
