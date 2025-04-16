
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConsultations } from "@/hooks/useConsultations";

export function useSessionsState() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('id');
  const clientId = searchParams.get('client');
  
  // Get consultations data
  const {
    searchQuery,
    setSearchQuery,
    upcomingConsultations,
    pastConsultations,
    filteredConsultations,
    addConsultation
  } = useConsultations();
  
  // UI state
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isConsultationDetailsOpen, setIsConsultationDetailsOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  
  // Process URL params
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
  
  // Escape key handler
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
  
  const handleCloseConsultationDetails = () => {
    setIsConsultationDetailsOpen(false);
    setSelectedConsultation(null);
    if (sessionId) {
      navigate('/sessions');
    }
  };
  
  return {
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
    setIsConsultationDetailsOpen,
    isReminderFormOpen,
    setIsReminderFormOpen,
    // Handlers
    handleCloseConsultationDetails
  };
}
