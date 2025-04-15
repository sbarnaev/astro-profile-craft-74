import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { ClientsSearch } from "@/components/clients/ClientsSearch";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsPagination } from "@/components/clients/ClientsPagination";
import { AddClientDialog } from "@/components/clients/AddClientDialog";

const initialClientsData = [
  { 
    id: 1, 
    name: "Анна Смирнова", 
    date: "14.04.1993", 
    phone: "+7 (900) 123-45-67", 
    analysisCount: 3, 
    lastAnalysis: "02.03.2025",
    source: "instagram",
    communicationChannel: "whatsapp"
  },
  { 
    id: 2, 
    name: "Иван Петров", 
    date: "28.02.1985", 
    phone: "+7 (911) 987-65-43", 
    analysisCount: 2, 
    lastAnalysis: "15.02.2025",
    source: "referral",
    communicationChannel: "telegram"
  },
  { id: 3, name: "Мария Иванова", date: "10.10.1990", phone: "+7 (905) 555-55-55", analysisCount: 5, lastAnalysis: "10.04.2025" },
  { id: 4, name: "Александр Козлов", date: "05.07.1982", phone: "+7 (926) 111-22-33", analysisCount: 1, lastAnalysis: "01.04.2025" },
  { id: 5, name: "Екатерина Новикова", date: "22.12.1988", phone: "+7 (903) 777-88-99", analysisCount: 4, lastAnalysis: "05.03.2025" },
  { id: 6, name: "Дмитрий Соколов", date: "18.06.1995", phone: "+7 (999) 444-33-22", analysisCount: 2, lastAnalysis: "20.02.2025" },
  { id: 7, name: "Ольга Васильева", date: "30.09.1987", phone: "+7 (916) 222-33-44", analysisCount: 6, lastAnalysis: "12.04.2025" },
  { id: 8, name: "Сергей Кузнецов", date: "15.11.1980", phone: "+7 (925) 666-77-88", analysisCount: 3, lastAnalysis: "18.03.2025" },
  { id: 9, name: "Наталья Морозова", date: "03.08.1992", phone: "+7 (917) 999-00-11", analysisCount: 1, lastAnalysis: "25.03.2025" },
  { id: 10, name: "Алексей Попов", date: "27.01.1986", phone: "+7 (915) 333-22-11", analysisCount: 4, lastAnalysis: "30.03.2025" },
  { id: 11, name: "Ирина Лебедева", date: "09.12.1983", phone: "+7 (926) 555-11-22", analysisCount: 2, lastAnalysis: "07.04.2025" },
  { id: 12, name: "Михаил Семенов", date: "19.03.1994", phone: "+7 (929) 777-66-55", analysisCount: 3, lastAnalysis: "15.03.2025" },
];

const Clients = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState(initialClientsData);
  const navigate = useNavigate();
  const location = useLocation();
  
  const itemsPerPage = 20;
  
  useEffect(() => {
    if (location.state?.newClient) {
      const newClient = location.state.newClient;
      console.log("Received new client from state:", newClient);
      
      if (!clients.some(client => client.id === newClient.id)) {
        setClients(prev => [newClient, ...prev]);
      }
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         client.phone.includes(searchValue);
    
    if (filterOption === "all") return matchesSearch;
    if (filterOption === "recent") return matchesSearch && new Date(client.lastAnalysis.split('.').reverse().join('-')) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
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
  
  const handleAddClient = (data: any, analysisData?: any) => {
    setOpen(false);
    console.log("New client data:", data);
    
    const newClientId = data.id || Math.floor(Math.random() * 10000) + 100;
    const newClient = {
      id: newClientId,
      name: `${data.lastName} ${data.firstName} ${data.patronymic || ""}`.trim(),
      date: data.dob ? new Intl.DateTimeFormat('ru-RU').format(data.dob) : "",
      phone: data.phone,
      analysisCount: analysisData ? 1 : 0,
      lastAnalysis: analysisData ? new Intl.DateTimeFormat('ru-RU').format(new Date()) : "",
      source: data.source,
      communicationChannel: data.communicationChannel
    };
    
    setClients(prev => [newClient, ...prev]);
    
    if (analysisData) {
      toast.success("Клиент и анализ успешно добавлены", {
        description: "Новый клиент и анализ были добавлены в базу данных."
      });
    } else {
      toast.success("Клиент успешно добавлен", {
        description: "Новый клиент был добавлен в базу данных."
      });
    }
    
    navigate(`/clients/${newClientId}`, { 
      state: { newClient }
    });
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

          <ClientsTable 
            clients={paginatedClients} 
            getCommunicationIcon={getCommunicationIcon} 
          />
          
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
