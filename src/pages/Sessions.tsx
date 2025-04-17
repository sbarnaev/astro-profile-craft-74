
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionsHeader } from "@/components/sessions/SessionsHeader";
import { SessionsSearch } from "@/components/sessions/SessionsSearch";
import { SessionsTabContent } from "@/components/sessions/SessionsTabContent";
import { SessionsDialogs } from "@/components/sessions/SessionsDialogs";
import { ConsultationDetails } from "@/components/consultations/ConsultationDetails";
import { useConsultations } from "@/hooks/useConsultations";

export default function Sessions() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const consultationId = searchParams.get('id');
  const clientId = searchParams.get('client');
  
  const {
    searchQuery,
    setSearchQuery,
    upcomingConsultations,
    pastConsultations,
    addConsultation,
    refetch
  } = useConsultations();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  
  // Открываем форму создания консультации если есть clientId в URL
  useEffect(() => {
    if (clientId) {
      // Здесь должен быть код для получения данных клиента и открытия формы консультации
      console.log(`Client ID from URL: ${clientId}`);
      // TODO: fetch client data and open consultation form
    }
  }, [clientId]);
  
  // Обработка параметров запроса для отображения деталей консультации
  useEffect(() => {
    if (consultationId) {
      const consultation = [...upcomingConsultations, ...pastConsultations].find(
        c => c.id === consultationId
      );
      if (consultation) {
        setSelectedConsultation(consultation);
        setIsConsultationDetailsOpen(true);
      }
    }
  }, [consultationId, upcomingConsultations, pastConsultations]);
  
  const handleOnNewConsultation = () => {
    setIsClientSearchOpen(true);
  };
  
  const handleConsultationClick = (consultation: any) => {
    setSelectedConsultation(consultation);
    setIsConsultationDetailsOpen(true);
    // Обновляем URL для отображения деталей консультации
    navigate(`/sessions?id=${consultation.id}`);
  };
  
  const handleCloseConsultationDetails = () => {
    setIsConsultationDetailsOpen(false);
    setSelectedConsultation(null);
    // Удаляем параметр id из URL при закрытии деталей
    navigate('/sessions');
  };

  // Если открыта детальная страница консультации, показываем только её
  if (isConsultationDetailsOpen && selectedConsultation) {
    return (
      <ConsultationDetails 
        consultation={selectedConsultation}
        onAddReminder={() => setIsReminderFormOpen(true)}
        onClose={handleCloseConsultationDetails}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SessionsHeader onNewSession={handleOnNewConsultation} />
      
      <SessionsSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="upcoming" className="text-sm">
            Предстоящие
          </TabsTrigger>
          <TabsTrigger value="past" className="text-sm">
            Прошедшие
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <SessionsTabContent 
            consultations={upcomingConsultations}
            type="upcoming"
            onNewConsultation={handleOnNewConsultation}
            onConsultationClick={handleConsultationClick}
          />
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <SessionsTabContent 
            consultations={pastConsultations}
            type="past"
            onNewConsultation={handleOnNewConsultation}
            onConsultationClick={handleConsultationClick}
          />
        </TabsContent>
      </Tabs>
      
      <SessionsDialogs 
        isClientSearchOpen={isClientSearchOpen}
        setIsClientSearchOpen={setIsClientSearchOpen}
        isClientFormOpen={isClientFormOpen}
        setIsClientFormOpen={setIsClientFormOpen}
        isConsultationFormOpen={isConsultationFormOpen}
        setIsConsultationFormOpen={setIsConsultationFormOpen}
        isReminderFormOpen={isReminderFormOpen}
        setIsReminderFormOpen={setIsReminderFormOpen}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        selectedConsultation={selectedConsultation}
        addConsultation={addConsultation}
        clientId={clientId}
      />
    </div>
  );
}
