import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientSearch } from "@/components/analysis/ClientSearch";
import { ClientForm } from "@/components/clients/ClientForm";
import { ConsultationForm } from "@/components/consultations/ConsultationForm";
import { ReminderForm } from "@/components/consultations/ReminderForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ConsultationFormValues } from "@/components/consultations/form/consultationFormSchema";

interface SessionsDialogsProps {
  isClientSearchOpen: boolean;
  setIsClientSearchOpen: (open: boolean) => void;
  isClientFormOpen: boolean;
  setIsClientFormOpen: (open: boolean) => void;
  isConsultationFormOpen: boolean;
  setIsConsultationFormOpen: (open: boolean) => void;
  isReminderFormOpen: boolean;
  setIsReminderFormOpen: (open: boolean) => void;
  selectedClient: any;
  setSelectedClient: (client: any) => void;
  selectedConsultation: any;
  addConsultation: (consultation: any) => void;
  clientId?: string | null;
}

export function SessionsDialogs({
  isClientSearchOpen,
  setIsClientSearchOpen,
  isClientFormOpen,
  setIsClientFormOpen,
  isConsultationFormOpen,
  setIsConsultationFormOpen,
  isReminderFormOpen,
  setIsReminderFormOpen,
  selectedClient,
  setSelectedClient,
  selectedConsultation,
  addConsultation,
  clientId
}: SessionsDialogsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClientSelect = (client: any) => {
    setIsClientSearchOpen(false);
    setSelectedClient(client);
    setIsConsultationFormOpen(true);
  };
  
  const handleCreateClient = async (data: any) => {
    try {
      if (!user) {
        toast.error("Вы не авторизованы");
        return;
      }
      
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          patronymic: data.patronymic || null,
          dob: data.dob,
          phone: data.phone,
          email: data.email || null,
          source: data.source || 'другое',
          communication_channel: data.communicationChannel || 'телефон',
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) {
        console.error("Ошибка при создании клиента:", error);
        toast.error("Произошла ошибка при создании клиента");
        return;
      }
      
      toast.success("Клиент успешно создан");
      
      setIsClientFormOpen(false);
      setSelectedClient({
        id: newClient.id,
        firstName: newClient.first_name,
        lastName: newClient.last_name,
        patronymic: newClient.patronymic,
        dob: newClient.dob,
        phone: newClient.phone,
        email: newClient.email
      });
      setIsConsultationFormOpen(true);
    } catch (error) {
      console.error("Ошибка при создании клиента:", error);
      toast.error("Произошла ошибка при создании клиента");
    }
  };
  
  const handleCreateConsultation = (data: ConsultationFormValues) => {
    console.log("Creating consultation with data:", data);
    
    if (!data || !data.id) {
      console.error("Missing consultation ID in data:", data);
      toast.error("Ошибка при создании сессии: отсутствует ID");
      return;
    }
    
    const newConsultation = {
      id: data.id,
      clientId: selectedClient.id,
      clientName: `${selectedClient.lastName} ${selectedClient.firstName}`,
      date: data.date,
      time: data.time,
      duration: data.duration,
      type: data.type,
      format: data.format,
      request: data.request,
      notes: data.notes || "",
      status: "scheduled"
    };
    
    console.log("Formatted consultation object:", newConsultation);
    
    addConsultation(newConsultation);
    
    setIsConsultationFormOpen(false);
    setSelectedClient(null);
    
    navigate('/sessions', { replace: true });
    
    setTimeout(() => {
      console.log(`Navigating to session details with ID: ${newConsultation.id}`);
      navigate(`/sessions?id=${newConsultation.id}`);
    }, 800);
  };
  
  const handleCreateReminder = (data: any) => {
    setIsReminderFormOpen(false);
    console.log("Created reminder for session:", data);
    toast.success("Напоминание создано");
  };

  return (
    <>
      <ClientSearch 
        isOpen={isClientSearchOpen} 
        onClose={() => setIsClientSearchOpen(false)}
        onSelect={handleClientSelect}
        onCreateNew={() => {
          setIsClientSearchOpen(false);
          setIsClientFormOpen(true);
        }}
      />
      
      <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создание нового клиента</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом клиенте
            </DialogDescription>
          </DialogHeader>
          <ClientForm 
            onSubmit={handleCreateClient}
            showCodes={false}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={isConsultationFormOpen} 
        onOpenChange={(open) => {
          setIsConsultationFormOpen(open);
          if (!open) {
            if (clientId) {
              navigate('/sessions', { replace: true });
            }
            setSelectedClient(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Запись на сессию</DialogTitle>
            <DialogDescription>
              Заполните информацию о новой консультации
            </DialogDescription>
          </DialogHeader>
          <ConsultationForm 
            client={selectedClient}
            onSubmit={handleCreateConsultation}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание напоминания</DialogTitle>
            <DialogDescription>
              Укажите детали напоминания
            </DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <ReminderForm
              isOpen={isReminderFormOpen}
              onClose={() => setIsReminderFormOpen(false)}
              onSubmit={handleCreateReminder}
              consultationId={selectedConsultation.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
