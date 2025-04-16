import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ConsultationList } from "@/components/consultations/ConsultationList";
import { ConsultationDetails } from "@/components/consultations/ConsultationDetails";
import { EmptyConsultationsList } from "@/components/consultations/EmptyConsultationsList";
import { useConsultations } from "@/hooks/useConsultations";
import { toast } from "sonner";

export default function Sessions() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('id');
  const clientId = searchParams.get('client');
  
  const {
    searchQuery,
    setSearchQuery,
    upcomingConsultations,
    pastConsultations,
    filteredConsultations,
    addConsultation
  } = useConsultations();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  
  useEffect(() => {
    if (sessionId) {
      const consultation = filteredConsultations.find(
        c => c.id === Number(sessionId)
      );
      if (consultation) {
        setSelectedConsultation(consultation);
        setIsConsultationDetailsOpen(true);
      }
    }
    
    if (clientId && !isConsultationFormOpen) {
      setSelectedClient({
        id: clientId,
        firstName: "Имя клиента",
        lastName: "Фамилия клиента",
        phone: "+7 (XXX) XXX-XX-XX"
      });
      setIsConsultationFormOpen(true);
    }
  }, [sessionId, clientId, filteredConsultations, isConsultationFormOpen]);
  
  const handleClientSelect = (client: any) => {
    setIsClientSearchOpen(false);
    setSelectedClient(client);
    setIsConsultationFormOpen(true);
  };
  
  const handleCreateClient = (data: any) => {
    setIsClientFormOpen(false);
    setSelectedClient({
      id: Date.now(),
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
    console.log("Creating consultation:", { ...data, client: selectedClient });
    
    const newConsultation = {
      id: Date.now(),
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
    
    if (addConsultation) {
      addConsultation(newConsultation);
    }
    
    toast.success("Консультация успешно запланирована");
    
    navigate('/sessions', { replace: true });
    
    setTimeout(() => {
      setSelectedConsultation(newConsultation);
      setIsConsultationDetailsOpen(true);
      navigate(`/sessions?id=${newConsultation.id}`);
    }, 300);
    
    setSelectedClient(null);
  };
  
  const handleCreateReminder = (data: any) => {
    setIsReminderFormOpen(false);
    console.log("Created reminder for session:", data);
  };
  
  const handleCloseConsultationDetails = () => {
    setIsConsultationDetailsOpen(false);
    setSelectedConsultation(null);
    if (sessionId) {
      navigate('/sessions');
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isConsultationFormOpen) {
          setIsConsultationFormOpen(false);
          if (clientId) {
            navigate('/sessions', { replace: true });
          }
          setSelectedClient(null);
        }
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isConsultationFormOpen, navigate, clientId]);

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Сессии</h1>
        <Button onClick={() => setIsClientSearchOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Записать на сессию
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
              navigate(`/sessions?id=${consultation.id}`);
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
              navigate(`/sessions?id=${consultation.id}`);
            }}
          />
        </TabsContent>
      </Tabs>
      
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
    </div>
  );
}
