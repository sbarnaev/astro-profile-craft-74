
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, FileText, Bell, Clock, User, Edit, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientConsultations } from "@/components/clients/ClientConsultations";
import { ClientAnalysis } from "@/components/clients/ClientAnalysis";
import { ClientReminders } from "@/components/clients/ClientReminders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Пример данных о клиентах для демонстрации
const clientsData = [
  { 
    id: 1, 
    firstName: "Анна", 
    lastName: "Смирнова", 
    patronymic: "Владимировна",
    dob: new Date(1993, 3, 14), 
    phone: "+7 (900) 123-45-67", 
    email: "anna@example.com",
    analysisCount: 3, 
    lastAnalysis: "02.03.2025" 
  },
  { 
    id: 2, 
    firstName: "Иван", 
    lastName: "Петров", 
    patronymic: "Сергеевич",
    dob: new Date(1985, 1, 28), 
    phone: "+7 (911) 987-65-43", 
    email: "ivan@example.com",
    analysisCount: 2, 
    lastAnalysis: "15.02.2025" 
  },
  // ... остальные клиенты
];

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  
  // Находим клиента по ID
  const client = clientsData.find(c => c.id === Number(id));
  
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Клиент не найден</h1>
        <p className="text-muted-foreground mb-8">Клиент с указанным ID не существует</p>
        <Button asChild>
          <Link to="/clients">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Вернуться к списку клиентов
          </Link>
        </Button>
      </div>
    );
  }
  
  const handleEditClient = () => {
    setOpen(false);
    toast.success("Данные клиента обновлены", {
      description: "Информация о клиенте была успешно обновлена."
    });
  };
  
  const fullName = `${client.lastName} ${client.firstName} ${client.patronymic || ""}`.trim();
  const formattedDate = new Intl.DateTimeFormat('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(client.dob);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/clients">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Профиль клиента</h1>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Редактировать данные клиента</DialogTitle>
              </DialogHeader>
              <ClientForm 
                onSubmit={handleEditClient} 
                initialData={{ 
                  firstName: client.firstName,
                  lastName: client.lastName,
                  patronymic: client.patronymic || "",
                  dob: client.dob,
                  phone: client.phone,
                  email: client.email || ""
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-none">
          <CardHeader className="pb-2">
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-medium text-primary">{client.firstName.charAt(0)}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">ФИО</p>
              <p className="font-medium">{fullName}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Дата рождения</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Телефон</p>
              <p className="font-medium">{client.phone}</p>
            </div>
            
            {client.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            )}
            
            <div className="pt-4 space-y-2">
              <Button className="w-full" asChild>
                <Link to={`/analysis/new?client=${client.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Новый анализ
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/consultations/schedule?client=${client.id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Записать на консультацию
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/reminders/new?client=${client.id}`}>
                  <Bell className="mr-2 h-4 w-4" />
                  Создать напоминание
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="consultations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consultations">
                <Calendar className="mr-2 h-4 w-4" />
                Консультации
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <FileText className="mr-2 h-4 w-4" />
                Анализы
              </TabsTrigger>
              <TabsTrigger value="reminders">
                <Bell className="mr-2 h-4 w-4" />
                Напоминания
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="consultations">
              <ClientConsultations clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="analysis">
              <ClientAnalysis clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="reminders">
              <ClientReminders clientId={client.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
