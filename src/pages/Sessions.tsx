
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationDetails } from "@/components/consultations/ConsultationDetails";
import { SessionsHeader } from "@/components/sessions/SessionsHeader";
import { SessionsSearch } from "@/components/sessions/SessionsSearch";
import { SessionsTabContent } from "@/components/sessions/SessionsTabContent";
import { SessionsDialogs } from "@/components/sessions/SessionsDialogs";
import { useSessionsState } from "@/hooks/useSessionsState";

export default function Sessions() {
  const {
    // URL parameters
    sessionId,
    clientId,
    // Consultations data
    searchQuery,
    setSearchQuery,
    upcomingConsultations,
    pastConsultations,
    filteredConsultations,
    addConsultation,
    // UI state
    activeTab,
    setActiveTab,
    isClientSearchOpen,
    setIsClientSearchOpen,
    isClientFormOpen,
    setIsClientFormOpen,
    isConsultationFormOpen,
    setIsConsultationFormOpen,
    selectedClient,
    setSelectedClient,
    selectedConsultation,
    setSelectedConsultation,
    isConsultationDetailsOpen,
    setIsConsultationDetailsOpen, // Fixed: Adding this to the destructured object
    isReminderFormOpen,
    setIsReminderFormOpen,
    // Handlers
    handleCloseConsultationDetails
  } = useSessionsState();

  // If showing consultation details
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
      <SessionsHeader onNewSession={() => setIsClientSearchOpen(true)} />
      
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
            onNewConsultation={() => setIsClientSearchOpen(true)}
            onConsultationClick={(consultation) => {
              setSelectedConsultation(consultation);
              setIsConsultationDetailsOpen(true);
              window.history.pushState({}, "", `/sessions?id=${consultation.id}`);
            }}
          />
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <SessionsTabContent 
            consultations={pastConsultations}
            type="past"
            onNewConsultation={() => setIsClientSearchOpen(true)}
            onConsultationClick={(consultation) => {
              setSelectedConsultation(consultation);
              setIsConsultationDetailsOpen(true);
              window.history.pushState({}, "", `/sessions?id=${consultation.id}`);
            }}
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
