
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientSearch } from "@/components/analysis/ClientSearch";
import { ClientForm } from "@/components/clients/ClientForm";
import { ConsultationForm } from "@/components/consultations/ConsultationForm";
import { ReminderForm } from "@/components/consultations/ReminderForm";
import { ConsultationList } from "@/components/consultations/ConsultationList";
import { ConsultationDetails } from "@/components/consultations/ConsultationDetails";
import { EmptyConsultationsList } from "@/components/consultations/EmptyConsultationsList";
import { useConsultations } from "@/hooks/useConsultations";

export default function Consultations() {
  const {
    searchQuery,
    setSearchQuery,
    upcomingConsultations,
    pastConsultations
  } = useConsultations();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  
  const handleClientSelect = (client: any) => {
    setIsClientSearchOpen(false);
    setSelectedClient(client);
    setIsConsultationFormOpen(true);
  };
  
  const handleCreateClient = (data: any) => {
    setIsClientFormOpen(false);
    // После создания клиента, открываем форму консультации с новым клиентом
    setSelectedClient({
      id: Date.now(), // Временный ID
      firstName: data.firstName,
      lastName: data.lastName,
      patronymic: data.patronymic,
      dob: data.dob,
      phone: data.phone,
      email: data.email
    });
    setIsConsultationFormOpen(true);
  };
  
  const handleCreateConsultation = (data: any) => {
    setIsConsultationFormOpen(false);
    console.log("Created consultation:", { ...data, client: selectedClient });
    setSelectedClient(null);
  };
  
  const handleCreateReminder = (data: any) => {
    setIsReminderFormOpen(false);
    console.log("Created reminder for consultation:", data);
  };
  
  const handleCloseConsultationDetails = () => {
    setIsConsultationDetailsOpen(false);
    setSelectedConsultation(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Консультации</h1>
        <Button onClick={() => setIsClientSearchOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Записать на консультацию
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Поиск по клиенту, запросу или дате..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
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
          <ConsultationList 
            consultations={upcomingConsultations}
            emptyMessage={
              <EmptyConsultationsList 
                type="upcoming" 
                onNewConsultation={() => setIsClientSearchOpen(true)}
              />
            }
            onConsultationClick={(consultation) => {
              setSelectedConsultation(consultation);
              setIsConsultationDetailsOpen(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <ConsultationList 
            consultations={pastConsultations}
            emptyMessage={
              <EmptyConsultationsList 
                type="past" 
                onNewConsultation={() => setIsClientSearchOpen(true)}
              />
            }
            onConsultationClick={(consultation) => {
              setSelectedConsultation(consultation);
              setIsConsultationDetailsOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>
      
      {/* Детальная информация о консультации в полноэкранном режиме */}
      {isConsultationDetailsOpen && selectedConsultation && (
        <ConsultationDetails 
          consultation={selectedConsultation}
          onAddReminder={() => setIsReminderFormOpen(true)}
          onClose={handleCloseConsultationDetails}
        />
      )}
      
      {/* Диалог поиска клиента */}
      <ClientSearch 
        isOpen={isClientSearchOpen} 
        onClose={() => setIsClientSearchOpen(false)}
        onSelect={handleClientSelect}
        onCreateNew={() => {
          setIsClientSearchOpen(false);
          setIsClientFormOpen(true);
        }}
      />
      
      {/* Диалог создания клиента */}
      <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создание нового клиента</DialogTitle>
          </DialogHeader>
          <ClientForm 
            onSubmit={handleCreateClient}
            showCodes={false}
          />
        </DialogContent>
      </Dialog>
      
      {/* Диалог создания консультации */}
      <Dialog open={isConsultationFormOpen} onOpenChange={setIsConsultationFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Запись на консультацию</DialogTitle>
          </DialogHeader>
          <ConsultationForm 
            client={selectedClient}
            onSubmit={handleCreateConsultation}
          />
        </DialogContent>
      </Dialog>
      
      {/* Диалог создания напоминания */}
      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание напоминания</DialogTitle>
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
    </div>
  );
}
