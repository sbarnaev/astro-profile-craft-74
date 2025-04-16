
import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

import { ClientProfileHeader } from "@/components/clients/profile/ClientProfileHeader";
import { ClientInfoCard } from "@/components/clients/profile/ClientInfoCard";
import { ClientDetailsTabs } from "@/components/clients/profile/ClientDetailsTabs";
import { ClientEditDialog } from "@/components/clients/profile/ClientEditDialog";
import { ReminderForm } from "@/components/consultations/ReminderForm";

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("consultations");
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  
  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) return null;

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
        
      if (clientError) {
        console.error('Ошибка при загрузке клиента:', clientError);
        throw new Error('Не удалось загрузить данные клиента');
      }
      
      const { data: analyses, error: analysisError } = await supabase
        .from('analysis')
        .select('id, created_at')
        .eq('client_id', id)
        .order('created_at', { ascending: false });
        
      if (analysisError) {
        console.error('Ошибка при загрузке анализов:', analysisError);
      }

      const hasAnalysis = analyses && analyses.length > 0;
      const lastAnalysis = hasAnalysis 
        ? new Date(analyses[0].created_at).toLocaleDateString('ru-RU') 
        : "";

      const analysisId = hasAnalysis ? analyses[0].id : null;
      
      return {
        id: clientData.id,
        firstName: clientData.first_name,
        lastName: clientData.last_name,
        patronymic: clientData.patronymic || "",
        dob: new Date(clientData.dob),
        phone: clientData.phone,
        email: clientData.email || "",
        source: clientData.source,
        communicationChannel: clientData.communication_channel,
        personalityCode: clientData.personality_code || 0,
        connectorCode: clientData.connector_code || 0,
        realizationCode: clientData.realization_code || 0,
        generatorCode: clientData.generator_code || 0,
        missionCode: clientData.mission_code || "0",
        analysisCount: analyses?.length || 0,
        lastAnalysis: lastAnalysis,
        hasAnalysis: hasAnalysis,
        analysisId: analysisId,
        revenue: 0,
        avatar: null
      };
    }
  });
  
  useEffect(() => {
    const handleOpenSessionDialog = (event: CustomEvent) => {
      const clientId = event.detail?.clientId;
      if (clientId) {
        navigate(`/sessions/schedule?client=${clientId}`);
      }
    };
    
    document.addEventListener('openSessionDialog', handleOpenSessionDialog as EventListener);
    
    return () => {
      document.removeEventListener('openSessionDialog', handleOpenSessionDialog as EventListener);
    };
  }, [navigate]);
  
  useEffect(() => {
    if (location.state?.openReminder) {
      setActiveTab("reminders");
      setOpenReminderDialog(true);
    }
  }, [location.state]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Клиент не найден</h1>
        <p className="text-muted-foreground mb-8">Клиент с указанным ID не существует или произошла ошибка при загрузке данных</p>
        <Button asChild>
          <Link to="/clients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к списку клиентов
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ClientProfileHeader 
        clientId={client.id} 
        setOpen={setOpen} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <ClientInfoCard 
            client={client} 
            setOpenReminderDialog={setOpenReminderDialog}
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <ClientDetailsTabs 
            clientId={client.id}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <ClientEditDialog 
          client={client}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </Dialog>

      <Dialog open={openReminderDialog} onOpenChange={setOpenReminderDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Создать напоминание</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {client && (
              <ReminderForm
                isOpen={openReminderDialog}
                onClose={() => setOpenReminderDialog(false)}
                onSubmit={(data) => {
                  console.log("Created reminder:", data);
                  toast.success("Напоминание создано");
                  setOpenReminderDialog(false);
                }}
                clientId={parseInt(client.id)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientProfile;
