
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FileText, Calendar, ChevronLeft, User, Clock, Plus, MoreHorizontal, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

// Пример данных о консультациях
const consultationsData = [
  { 
    id: 1, 
    clientId: 1, 
    clientName: "Анна Смирнова",
    date: "2025-04-15T10:00:00", 
    duration: 60,
    status: "upcoming", 
    type: "personal",
    notes: "Первичная консультация. Обсудить результаты анализа личностного кода.",
    payment: { status: "pending", amount: 3500 }
  },
  { 
    id: 2, 
    clientId: 2, 
    clientName: "Иван Петров",
    date: "2025-04-16T14:30:00", 
    duration: 90,
    status: "upcoming", 
    type: "astro-analysis",
    notes: "Детальный разбор личностных характеристик на основе анализа.",
    payment: { status: "paid", amount: 5000 }
  },
  { 
    id: 3, 
    clientId: 3, 
    clientName: "Мария Иванова",
    date: "2025-04-10T11:00:00", 
    duration: 60,
    status: "completed", 
    type: "personal",
    notes: "Клиент интересуется глубоким анализом личностных характеристик.",
    payment: { status: "paid", amount: 3500 }
  },
  { 
    id: 4, 
    clientId: 5, 
    clientName: "Екатерина Новикова",
    date: "2025-04-12T16:00:00", 
    duration: 120,
    status: "completed", 
    type: "complex",
    notes: "Комплексный анализ и рекомендации по развитию сильных сторон.",
    payment: { status: "paid", amount: 7000 }
  },
  { 
    id: 5, 
    clientId: 4, 
    clientName: "Александр Козлов",
    date: "2025-04-18T09:30:00", 
    duration: 60,
    status: "upcoming", 
    type: "personal",
    notes: "Первичная консультация после базового анализа.",
    payment: { status: "pending", amount: 3500 }
  },
  { 
    id: 6, 
    clientId: 1, 
    clientName: "Анна Смирнова",
    date: "2025-04-02T13:00:00", 
    duration: 30,
    status: "completed", 
    type: "followup",
    notes: "Короткая follow-up консультация по результатам прошлой встречи.",
    payment: { status: "paid", amount: 1500 }
  },
  { 
    id: 7, 
    clientId: 8, 
    clientName: "Сергей Кузнецов",
    date: "2025-04-20T15:00:00", 
    duration: 90,
    status: "upcoming", 
    type: "astro-analysis",
    notes: "Детальный анализ кодов и их влияние на текущую жизненную ситуацию.",
    payment: { status: "pending", amount: 5000 }
  },
];

export default function Consultations() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Если есть id в URL, показываем детальную информацию о консультации
  if (id) {
    const consultation = consultationsData.find(c => c.id === Number(id));
    
    if (!consultation) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">Консультация не найдена</h1>
          <p className="text-muted-foreground mb-8">Консультация с указанным ID не существует</p>
          <Button asChild>
            <Link to="/consultations">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Вернуться к списку консультаций
            </Link>
          </Button>
        </div>
      );
    }
    
    const formattedDate = new Date(consultation.date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Получаем статус консультации в виде текста и класса бейджа
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'upcoming':
          return { text: 'Предстоит', variant: 'warning' as const };
        case 'completed':
          return { text: 'Завершена', variant: 'success' as const };
        case 'cancelled':
          return { text: 'Отменена', variant: 'destructive' as const };
        default:
          return { text: 'Неизвестно', variant: 'secondary' as const };
      }
    };
    
    // Получаем тип консультации в виде текста
    const getTypeText = (type: string) => {
      switch (type) {
        case 'personal':
          return 'Персональная консультация';
        case 'astro-analysis':
          return 'Астро-анализ';
        case 'complex':
          return 'Комплексная консультация';
        case 'followup':
          return 'Follow-up консультация';
        default:
          return 'Другое';
      }
    };
    
    // Получаем статус оплаты в виде текста и класса бейджа
    const getPaymentStatusInfo = (status: string) => {
      switch (status) {
        case 'paid':
          return { text: 'Оплачено', variant: 'success' as const };
        case 'pending':
          return { text: 'Ожидает оплаты', variant: 'warning' as const };
        case 'failed':
          return { text: 'Ошибка оплаты', variant: 'destructive' as const };
        default:
          return { text: 'Неизвестно', variant: 'secondary' as const };
      }
    };
    
    const statusInfo = getStatusInfo(consultation.status);
    const paymentStatusInfo = getPaymentStatusInfo(consultation.payment.status);
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/consultations">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Детали консультации</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/clients/${consultation.clientId}`)}>
              <User className="mr-2 h-4 w-4" />
              Профиль клиента
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  Действия
                  <ChevronLeft className="ml-2 h-4 w-4 rotate-270" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => 
                  toast.success("Напоминание отправлено клиенту", {
                    description: "SMS и Email уведомления успешно отправлены."
                  })
                }>
                  Отправить напоминание
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/consultations/edit/${consultation.id}`)}>
                  Редактировать консультацию
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigate("/consultations");
                  toast.success("Консультация отменена", {
                    description: "Консультация была успешно отменена."
                  });
                }}
                className="text-destructive">
                  Отменить консультацию
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 border-none">
            <CardHeader>
              <CardTitle>Информация о консультации</CardTitle>
              <CardDescription>Детали предстоящей консультации</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Статус</div>
                  <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Тип консультации</div>
                  <div>{getTypeText(consultation.type)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Длительность</div>
                  <div>{consultation.duration} минут</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Дата и время</div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formattedDate}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Клиент</div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Link to={`/clients/${consultation.clientId}`} className="hover:underline">
                      {consultation.clientName}
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Оплата</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground mr-2">Сумма:</span>
                      {consultation.payment.amount} ₽
                    </div>
                    <Badge variant={paymentStatusInfo.variant}>{paymentStatusInfo.text}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Заметки</div>
                  <p>{consultation.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Материалы</CardTitle>
              <CardDescription>Документы и ресурсы для консультации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link to={`/analysis/${consultation.clientId}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Личностный анализ клиента
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="#">
                    <FileText className="mr-2 h-4 w-4" />
                    Шаблон отчета по консультации
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start text-muted-foreground">
                  <FileText className="mr-2 h-4 w-4" />
                  История предыдущих консультаций
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Если нет id в URL, показываем список консультаций
  
  // Фильтруем консультации
  const filteredConsultations = consultationsData.filter(consultation => {
    const matchesSearch = consultation.clientName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
    const matchesType = typeFilter === "all" || consultation.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Сортируем консультации по дате (сначала ближайшие)
  const sortedConsultations = [...filteredConsultations].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Разделяем на страницы
  const paginatedConsultations = sortedConsultations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(sortedConsultations.length / itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="warning">Предстоит</Badge>;
      case 'completed':
        return <Badge variant="success">Завершена</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Отменена</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };
  
  const getConsultationType = (type: string) => {
    switch (type) {
      case 'personal':
        return 'Персональная';
      case 'astro-analysis':
        return 'Астро-анализ';
      case 'complex':
        return 'Комплексная';
      case 'followup':
        return 'Follow-up';
      default:
        return 'Другое';
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Консультации</h1>
          <p className="text-muted-foreground">
            Управление консультациями и расписанием
          </p>
        </div>
        <Button asChild>
          <Link to="/consultations/new">
            <Plus className="mr-2 h-4 w-4" />
            Записать на консультацию
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="all">Все консультации</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <Card className="border-none">
            <CardHeader className="pb-2">
              <CardTitle>Предстоящие консультации</CardTitle>
              <CardDescription>
                Запланированные консультации с клиентами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Поиск по имени клиента..." 
                    className="pl-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Тип консультации" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="personal">Персональная</SelectItem>
                    <SelectItem value="astro-analysis">Астро-анализ</SelectItem>
                    <SelectItem value="complex">Комплексная</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="py-3 px-4 text-left">Клиент</th>
                        <th className="py-3 px-4 text-left">Дата и время</th>
                        <th className="py-3 px-4 text-center hidden md:table-cell">Тип</th>
                        <th className="py-3 px-4 text-center hidden lg:table-cell">Длительность</th>
                        <th className="py-3 px-4 text-center">Статус</th>
                        <th className="py-3 px-4 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedConsultations
                        .filter(c => c.status === 'upcoming')
                        .map((consultation) => {
                          const consultationDate = new Date(consultation.date);
                          const formattedDate = consultationDate.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                          
                          return (
                            <tr key={consultation.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4">
                                <Link to={`/clients/${consultation.clientId}`} className="hover:underline">
                                  {consultation.clientName}
                                </Link>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {formattedDate}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center hidden md:table-cell">
                                {getConsultationType(consultation.type)}
                              </td>
                              <td className="py-3 px-4 text-center hidden lg:table-cell">
                                <div className="flex items-center justify-center">
                                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                  {consultation.duration} мин
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {getStatusBadge(consultation.status)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/consultations/${consultation.id}`}>
                                        Детали
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => 
                                      toast.success("Напоминание отправлено клиенту", {
                                        description: "SMS и Email уведомления успешно отправлены."
                                      })
                                    }>
                                      Отправить напоминание
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link to={`/consultations/edit/${consultation.id}`}>
                                        Редактировать
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => {
                                        toast.success("Консультация отменена", {
                                          description: "Консультация была успешно отменена."
                                        });
                                      }}
                                    >
                                      Отменить
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      
                      {paginatedConsultations.filter(c => c.status === 'upcoming').length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            Предстоящих консультаций не найдено
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
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card className="border-none">
            <CardHeader className="pb-2">
              <CardTitle>Завершенные консультации</CardTitle>
              <CardDescription>
                История проведенных консультаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Поиск по имени клиента..." 
                    className="pl-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Тип консультации" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="personal">Персональная</SelectItem>
                    <SelectItem value="astro-analysis">Астро-анализ</SelectItem>
                    <SelectItem value="complex">Комплексная</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="py-3 px-4 text-left">Клиент</th>
                        <th className="py-3 px-4 text-left">Дата и время</th>
                        <th className="py-3 px-4 text-center hidden md:table-cell">Тип</th>
                        <th className="py-3 px-4 text-center hidden lg:table-cell">Длительность</th>
                        <th className="py-3 px-4 text-center">Статус</th>
                        <th className="py-3 px-4 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedConsultations
                        .filter(c => c.status === 'completed')
                        .map((consultation) => {
                          const consultationDate = new Date(consultation.date);
                          const formattedDate = consultationDate.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                          
                          return (
                            <tr key={consultation.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4">
                                <Link to={`/clients/${consultation.clientId}`} className="hover:underline">
                                  {consultation.clientName}
                                </Link>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {formattedDate}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center hidden md:table-cell">
                                {getConsultationType(consultation.type)}
                              </td>
                              <td className="py-3 px-4 text-center hidden lg:table-cell">
                                <div className="flex items-center justify-center">
                                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                  {consultation.duration} мин
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {getStatusBadge(consultation.status)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/consultations/${consultation.id}`}>
                                        Детали
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link to="#">
                                        Отчет о консультации
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link to={`/consultations/edit/${consultation.id}`}>
                                        Редактировать отчет
                                      </Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })}
                      
                      {paginatedConsultations.filter(c => c.status === 'completed').length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            Завершенных консультаций не найдено
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
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <Card className="border-none">
            <CardHeader className="pb-2">
              <CardTitle>Все консультации</CardTitle>
              <CardDescription>
                Полный список консультаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Поиск по имени клиента..." 
                    className="pl-8"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="upcoming">Предстоящие</SelectItem>
                    <SelectItem value="completed">Завершенные</SelectItem>
                    <SelectItem value="cancelled">Отмененные</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Тип консультации" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="personal">Персональная</SelectItem>
                    <SelectItem value="astro-analysis">Астро-анализ</SelectItem>
                    <SelectItem value="complex">Комплексная</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 font-medium">
                        <th className="py-3 px-4 text-left">Клиент</th>
                        <th className="py-3 px-4 text-left">Дата и время</th>
                        <th className="py-3 px-4 text-center hidden md:table-cell">Тип</th>
                        <th className="py-3 px-4 text-center hidden lg:table-cell">Длительность</th>
                        <th className="py-3 px-4 text-center">Статус</th>
                        <th className="py-3 px-4 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedConsultations.length > 0 ? (
                        paginatedConsultations.map((consultation) => {
                          const consultationDate = new Date(consultation.date);
                          const formattedDate = consultationDate.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                          
                          return (
                            <tr key={consultation.id} className="border-b hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4">
                                <Link to={`/clients/${consultation.clientId}`} className="hover:underline">
                                  {consultation.clientName}
                                </Link>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {formattedDate}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center hidden md:table-cell">
                                {getConsultationType(consultation.type)}
                              </td>
                              <td className="py-3 px-4 text-center hidden lg:table-cell">
                                <div className="flex items-center justify-center">
                                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                  {consultation.duration} мин
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {getStatusBadge(consultation.status)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/consultations/${consultation.id}`}>
                                        Детали
                                      </Link>
                                    </DropdownMenuItem>
                                    {consultation.status === 'upcoming' && (
                                      <>
                                        <DropdownMenuItem onClick={() => 
                                          toast.success("Напоминание отправлено клиенту", {
                                            description: "SMS и Email уведомления успешно отправлены."
                                          })
                                        }>
                                          Отправить напоминание
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          className="text-destructive"
                                          onClick={() => {
                                            toast.success("Консультация отменена", {
                                              description: "Консультация была успешно отменена."
                                            });
                                          }}
                                        >
                                          Отменить
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {consultation.status === 'completed' && (
                                      <DropdownMenuItem asChild>
                                        <Link to="#">
                                          Отчет о консультации
                                        </Link>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            Консультации не найдены
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
