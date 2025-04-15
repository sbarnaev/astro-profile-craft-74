
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { ClientsTable, Client } from "@/components/clients/ClientsTable";
import { ClientsPagination } from "@/components/clients/ClientsPagination";
import { AddClientDialog } from "@/components/clients/AddClientDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Clients = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const itemsPerPage = 20;
  
  // Загрузка клиентов из Supabase
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Ошибка при загрузке клиентов:', error);
        toast.error('Не удалось загрузить список клиентов');
        return [];
      }
      
      // Загружаем количество анализов для каждого клиента
      const clientsWithAnalysisCount: Client[] = [];
      
      for (const client of data) {
        // Получаем количество и последний анализ
        const { data: analyses, error: analysisError } = await supabase
          .from('analysis')
          .select('created_at')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false });
          
        if (analysisError) {
          console.error('Ошибка при загрузке анализов:', analysisError);
        }
        
        const lastAnalysisDate = analyses && analyses.length > 0 
          ? new Date(analyses[0].created_at).toLocaleDateString('ru-RU') 
          : "";
        
        clientsWithAnalysisCount.push({
          id: client.id,
          name: `${client.last_name} ${client.first_name} ${client.patronymic || ''}`.trim(),
          date: client.dob ? new Date(client.dob).toLocaleDateString('ru-RU') : "",
          phone: client.phone,
          analysisCount: analyses?.length || 0,
          lastAnalysis: lastAnalysisDate,
          source: client.source,
          communicationChannel: client.communication_channel
        });
      }
      
      return clientsWithAnalysisCount;
    }
  });
  
  // Мутация для добавления клиента
  const addClientMutation = useMutation({
    mutationFn: async (clientData: any) => {
      // Преобразование данных клиента для Supabase
      const supabaseClient = {
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        patronymic: clientData.patronymic || null,
        dob: clientData.dob,
        phone: clientData.phone,
        email: clientData.email || null,
        source: clientData.source,
        communication_channel: clientData.communicationChannel,
        personality_code: clientData.personalityCode || null,
        connector_code: clientData.connectorCode || null,
        realization_code: clientData.realizationCode || null,
        generator_code: clientData.generatorCode || null,
        mission_code: clientData.missionCode || null
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert(supabaseClient)
        .select()
        .single();
        
      if (error) {
        console.error('Ошибка при создании клиента:', error);
        throw new Error('Не удалось создать клиента');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });
  
  // Мутация для добавления анализа
  const addAnalysisMutation = useMutation({
    mutationFn: async (analysisData: any) => {
      const supabaseAnalysis = {
        client_id: analysisData.clientId,
        type: analysisData.type,
        title: analysisData.title,
        status: analysisData.status,
        codes: analysisData.codes
      };
      
      const { data, error } = await supabase
        .from('analysis')
        .insert(supabaseAnalysis)
        .select();
        
      if (error) {
        console.error('Ошибка при создании анализа:', error);
        throw new Error('Не удалось создать анализ');
      }
      
      return data;
    }
  });
  
  useEffect(() => {
    if (location.state?.newClient) {
      const newClient = location.state.newClient;
      console.log("Received new client from state:", newClient);
      
      // Сбросить состояние маршрута, чтобы избежать дублирования
      window.history.replaceState({}, document.title);
      
      // Обновить список клиентов
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  }, [location.state, queryClient]);
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         client.phone.includes(searchValue);
    
    if (filterOption === "all") return matchesSearch;
    if (filterOption === "recent") {
      const lastDate = client.lastAnalysis ? 
        new Date(client.lastAnalysis.split('.').reverse().join('-')) : null;
      return matchesSearch && lastDate && lastDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    if (filterOption === "frequent") return matchesSearch && client.analysisCount > 3;
    
    return matchesSearch;
  });
  
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleAddClient = async (data: any, analysisData?: any) => {
    setOpen(false);
    console.log("New client data:", data);
    
    try {
      // Создаем клиента в базе данных
      const newClient = await addClientMutation.mutateAsync(data);
      console.log("Client created in database:", newClient);
      
      // Если есть данные анализа, создаем анализ
      if (analysisData) {
        analysisData.clientId = newClient.id;
        await addAnalysisMutation.mutateAsync(analysisData);
        toast.success("Клиент и анализ успешно добавлены", {
          description: "Новый клиент и анализ были добавлены в базу данных."
        });
      } else {
        toast.success("Клиент успешно добавлен", {
          description: "Новый клиент был добавлен в базу данных."
        });
      }
      
      // Перенаправляем на страницу клиента
      navigate(`/clients/${newClient.id}`);
      
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Ошибка при добавлении клиента", {
        description: "Пожалуйста, попробуйте еще раз или обратитесь к администратору."
      });
    }
  };

  const getCommunicationIcon = (channel: string) => {
    if (!channel) return null;
    
    switch (channel.toLowerCase()) {
      case 'whatsapp':
        return <span className="text-green-500 text-xs">WhatsApp</span>;
      case 'telegram':
        return <span className="text-blue-500 text-xs">Telegram</span>;
      case 'viber':
        return <span className="text-purple-500 text-xs">Viber</span>;
      case 'vk':
        return <span className="text-blue-600 text-xs">ВКонтакте</span>;
      case 'offline':
        return <span className="text-gray-500 text-xs">Офлайн</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Клиенты</h1>
          <p className="text-muted-foreground">Управление базой клиентов</p>
        </div>
        <AddClientDialog 
          open={open} 
          setOpen={setOpen} 
          handleAddClient={handleAddClient} 
        />
      </div>

      <Card className="astro-card border-none">
        <CardHeader className="pb-2">
          <CardTitle>Список клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsSearch 
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
          />

          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ClientsTable 
              clients={paginatedClients} 
              getCommunicationIcon={getCommunicationIcon} 
            />
          )}
          
          <ClientsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
