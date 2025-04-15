
import { useState, useMemo } from "react";
import { format } from "date-fns";

// Mock consultation data
const consultationsData = [
  { 
    id: 1,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 3, 5, 14, 30),
    duration: 60,
    type: "basic",
    format: "video",
    status: "scheduled",
    notes: "Первичная консультация",
    request: "Хочу разобраться с проблемами в личной жизни"
  },
  { 
    id: 2,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 2, 20, 11, 0),
    duration: 90,
    type: "relationship",
    format: "in-person",
    status: "completed",
    notes: "Обсуждение результатов анализа",
    request: "Нужна помощь в понимании направления развития карьеры"
  },
  { 
    id: 3,
    clientId: 2,
    clientName: "Петрова Анна",
    clientPhone: "+7 (900) 987-65-43",
    clientDob: new Date(1985, 8, 20),
    date: new Date(2025, 2, 1, 16, 0),
    duration: 60,
    type: "express",
    format: "video",
    status: "completed",
    notes: "Разбор профиля и потенциала",
    request: "Хочу понять свое предназначение и таланты"
  },
];

export const useConsultations = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter consultations based on search query
  const filteredConsultations = useMemo(() => {
    return consultationsData.filter(consultation => {
      const query = searchQuery.toLowerCase();
      return (
        consultation.clientName.toLowerCase().includes(query) ||
        consultation.clientPhone.includes(query) ||
        consultation.request.toLowerCase().includes(query) ||
        format(consultation.date, "dd.MM.yyyy").includes(query)
      );
    });
  }, [searchQuery]);
  
  // Split consultations into upcoming and past
  const upcomingConsultations = useMemo(() => {
    return filteredConsultations
      .filter(consultation => 
        consultation.status === "scheduled" && consultation.date > new Date()
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredConsultations]);
  
  const pastConsultations = useMemo(() => {
    return filteredConsultations
      .filter(consultation => 
        consultation.status === "completed" || consultation.date <= new Date()
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filteredConsultations]);

  return {
    searchQuery,
    setSearchQuery,
    filteredConsultations,
    upcomingConsultations,
    pastConsultations
  };
};
