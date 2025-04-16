
import { useState, useEffect } from "react";

// Example consultation data - in a real app this would come from your database
const initialConsultations = [
  {
    id: 1,
    clientId: 101,
    clientName: "Иванов Иван",
    date: new Date(2025, 4, 25),
    time: "10:00",
    duration: 60,
    type: "basic",
    format: "video",
    status: "scheduled",
    request: "Консультация по вопросам карьеры",
    notes: ""
  },
  {
    id: 2,
    clientId: 102,
    clientName: "Петрова Анна",
    date: new Date(2025, 4, 20),
    time: "14:30",
    duration: 90,
    type: "relationship",
    format: "in-person",
    status: "scheduled",
    request: "Проблемы в отношениях с партнером",
    notes: "Клиент записан повторно"
  },
  {
    id: 3,
    clientId: 103,
    clientName: "Сидоров Михаил",
    date: new Date(2025, 3, 15),
    time: "11:00",
    duration: 60,
    type: "express",
    format: "video",
    status: "completed",
    request: "Вопросы личностного роста",
    notes: ""
  }
];

export function useConsultations() {
  const [consultations, setConsultations] = useState(initialConsultations);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter consultations based on search query
  const filteredConsultations = consultations.filter(consultation => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      consultation.clientName.toLowerCase().includes(searchLower) ||
      consultation.request.toLowerCase().includes(searchLower) ||
      consultation.type.toLowerCase().includes(searchLower) ||
      (consultation.date && 
        consultation.date.toLocaleDateString().includes(searchQuery))
    );
  });
  
  // Separate consultations into upcoming and past
  const currentDate = new Date();
  
  const upcomingConsultations = filteredConsultations.filter(consultation => {
    const consultationDate = new Date(consultation.date);
    return (
      consultationDate >= currentDate || 
      consultation.status === "scheduled"
    );
  });
  
  const pastConsultations = filteredConsultations.filter(consultation => {
    const consultationDate = new Date(consultation.date);
    return (
      consultationDate < currentDate || 
      consultation.status === "completed"
    );
  });
  
  // Function to add a new consultation
  const addConsultation = (newConsultation: any) => {
    setConsultations(prevConsultations => [...prevConsultations, newConsultation]);
  };
  
  return {
    consultations,
    setConsultations,
    searchQuery,
    setSearchQuery,
    filteredConsultations,
    upcomingConsultations,
    pastConsultations,
    addConsultation
  };
}
