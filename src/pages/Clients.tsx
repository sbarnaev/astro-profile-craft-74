
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal, UserPlus, Calendar, FileText, Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ClientForm } from "@/components/clients/ClientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const clientsData = [
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
  
  const itemsPerPage = 5;
  
  const filteredClients = clientsData.filter(client => {
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
    
    if (analysisData) {
      console.log("Analysis data:", analysisData);
      // В реальном приложении здесь был бы API-запрос для сохранения анализа
      toast.success("Клиент и анализ успешно добавлены", {
        description: "Новый клиент и анализ были добавлены в базу данных."
      });
    } else {
      toast.success("Клиент успешно добавлен", {
        description: "Новый клиент был добавлен в базу данных."
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить клиента
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить нового клиента</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={handleAddClient} generateAnalysis={true} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="astro-card border-none">
        <CardHeader className="pb-2">
          <CardTitle>Список клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Поиск по имени или телефону..." 
                className="pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Фильтры" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все клиенты</SelectItem>
                <SelectItem value="recent">Недавние</SelectItem>
                <SelectItem value="frequent">Частые</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 font-medium">
                    <th className="py-3 px-4 text-left">Имя</th>
                    <th className="py-3 px-4 text-left">Дата рождения</th>
                    <th className="py-3 px-4 text-left hidden md:table-cell">Телефон</th>
                    <th className="py-3 px-4 text-center hidden lg:table-cell">Канал</th>
                    <th className="py-3 px-4 text-center hidden lg:table-cell">Анализы</th>
                    <th className="py-3 px-4 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client) => (
                      <tr 
                        key={client.id} 
                        className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/clients/${client.id}`}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <Link to={`/clients/${client.id}`} className="block">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <span className="text-xs font-medium text-primary">{client.name.charAt(0)}</span>
                              </div>
                              <span>{client.name}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 px-4">{client.date}</td>
                        <td className="py-3 px-4 hidden md:table-cell">{client.phone}</td>
                        <td className="py-3 px-4 text-center hidden lg:table-cell">
                          {getCommunicationIcon(client.communicationChannel)}
                        </td>
                        <td className="py-3 px-4 text-center hidden lg:table-cell">{client.analysisCount}</td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/clients/${client.id}`}>Профиль</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/analysis/${client.id}`}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  <span>Анализ</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/consultations/schedule?client=${client.id}`}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  <span>Записать на консультацию</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/clients/${client.id}`} state={{ openReminder: true }}>
                                  <Bell className="mr-2 h-4 w-4" />
                                  <span>Создать напоминание</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Удалить</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-muted-foreground">
                        Клиенты не найдены
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
