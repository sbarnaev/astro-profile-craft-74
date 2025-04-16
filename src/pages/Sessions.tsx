
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
} from "@/components/ui/dialog";
import { ClientSearch } from "@/components/analysis/ClientSearch";
import { ClientForm } from "@/components/clients/ClientForm";
import { ConsultationForm } from "@/components/consultations/ConsultationForm";
import { ReminderForm } from "@/components/consultations/ReminderForm";
import { ConsultationList } from "@/components/consultations/ConsultationList";
import { ConsultationDetails } from "@/components/consultations/ConsultationDetails";
import { EmptyConsultationsList } from "@/components/consultations/EmptyConsultationsList";
import { useConsultations } from "@/hooks/useConsultations";

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
    filteredConsultations
  } = useConsultations();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  
  // Обработка параметров запроса для отображения деталей сессии
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
    
    // Если есть параметр client, открываем форму создания сессии для этого клиента
    if (clientId && !isConsultationFormOpen) {
      // Имитация получения данных клиента
      setSelectedClient({
        id: clientId,
        firstName: "Имя клиента", // В реальном приложении получаем из базы данных
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
    // После создания клиента, открываем форму сессии с новым клиентом
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
    console.log("Created session:", { ...data, client: selectedClient });
    
    // Create a new consultation
    const newConsultation = {
      id: Date.now(),
      clientId: parseInt(selectedClient.id),
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
    
    // Clear URL parameters
    navigate('/sessions', { replace: true });
    
    // Redirect to the new consultation detail
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
    // Удаляем параметр id из URL при закрытии деталей
    if (sessionId) {
      navigate('/sessions');
    }
  };

  // Add handler to close the consultation form when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isConsultationFormOpen) {
          setIsConsultationFormOpen(false);
          // Clear URL parameters
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

  // Если открыта детальная страница сессии, показываем только её
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
              // Обновляем URL для отображения деталей сессии
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
              // Обновляем URL для отображения деталей сессии
              navigate(`/sessions?id=${consultation.id}`);
            }}
          />
        </TabsContent>
      </Tabs>
      
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
      
      {/* Диалог создания сессии */}
      <Dialog 
        open={isConsultationFormOpen} 
        onOpenChange={(open) => {
          setIsConsultationFormOpen(open);
          if (!open) {
            // Clear URL parameters when dialog is closed
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
