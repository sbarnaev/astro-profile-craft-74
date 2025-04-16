
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function useConsultations() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  
  // Загрузка данных при монтировании компонента и при изменении пользователя
  useEffect(() => {
    if (user) {
      fetchConsultations();
    }
  }, [user]);
  
  // Функция для загрузки консультаций из Supabase
  const fetchConsultations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            patronymic,
            phone,
            dob
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Ошибка при загрузке консультаций:", error);
        toast.error("Не удалось загрузить список консультаций");
        return;
      }
      
      // Преобразование данных в нужный формат
      const formattedConsultations = data.map(item => ({
        id: item.id,
        clientId: item.client_id,
        clientName: item.clients ? `${item.clients.last_name} ${item.clients.first_name}` : "Неизвестный клиент",
        clientPhone: item.clients?.phone || "",
        // Проверяем наличие dob перед использованием
        clientDob: item.clients?.dob ? new Date(item.clients.dob) : null,
        date: new Date(item.date),
        time: item.time,
        duration: item.duration,
        type: item.type,
        format: item.format,
        status: item.status,
        request: item.request,
        notes: item.notes || ""
      }));
      
      setConsultations(formattedConsultations);
    } catch (error) {
      console.error("Ошибка при загрузке консультаций:", error);
      toast.error("Произошла ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };
  
  // Filter consultations based on search query
  const filteredConsultations = consultations.filter(consultation => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      consultation.clientName.toLowerCase().includes(searchLower) ||
      consultation.request.toLowerCase().includes(searchLower) ||
      consultation.type.toLowerCase().includes(searchLower) ||
      (consultation.date && 
        format(consultation.date, 'dd.MM.yyyy').includes(searchQuery))
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
  
  // Функция для добавления новой консультации
  const addConsultation = async (newConsultation: any) => {
    if (!user) return;
    
    // Include user_id with the new consultation
    const consultationWithUser = {
      ...newConsultation,
      user_id: user.id
    };
    
    // Сохраняем локально для немедленного обновления UI
    setConsultations(prevConsultations => [...prevConsultations, consultationWithUser]);
    // Обновляем данные с сервера
    await fetchConsultations();
  };
  
  return {
    consultations,
    setConsultations,
    searchQuery,
    setSearchQuery,
    filteredConsultations,
    upcomingConsultations,
    pastConsultations,
    addConsultation,
    loading,
    refetch: fetchConsultations
  };
}
