
import { useState } from "react";
import { Search, UserPlus, User, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Пример данных о клиентах
const clientsData = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Иванов",
    patronymic: "Иванович",
    dob: new Date(1990, 5, 15),
    phone: "+7 (900) 123-45-67",
    email: "ivan@example.com",
  },
  {
    id: 2,
    firstName: "Анна",
    lastName: "Петрова",
    patronymic: "Сергеевна",
    dob: new Date(1985, 8, 20),
    phone: "+7 (900) 987-65-43",
    email: "anna@example.com",
  },
  {
    id: 3,
    firstName: "Сергей",
    lastName: "Смирнов",
    patronymic: "Петрович",
    dob: new Date(1982, 2, 10),
    phone: "+7 (900) 456-78-90",
    email: "sergey@example.com",
  },
];

interface ClientSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (client: any) => void;
  onCreateNew: () => void;
}

export function ClientSearch({ isOpen, onClose, onSelect, onCreateNew }: ClientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Фильтрация клиентов по поисковому запросу
  const filteredClients = clientsData.filter(client => {
    const query = searchQuery.toLowerCase();
    const fullName = `${client.lastName} ${client.firstName} ${client.patronymic}`.toLowerCase();
    
    return (
      fullName.includes(query) ||
      client.phone.includes(query) ||
      (client.email && client.email.toLowerCase().includes(query)) ||
      format(client.dob, "dd.MM.yyyy").includes(query)
    );
  });
  
  const getFullName = (client: any) => {
    return `${client.lastName} ${client.firstName} ${client.patronymic || ""}`.trim();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Выбор клиента для анализа</DialogTitle>
          <DialogDescription>
            Найдите существующего клиента или создайте нового
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по ФИО, телефону или email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-3 hover:bg-muted cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                onClick={() => onSelect(client)}
              >
                <div>
                  <div className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    {getFullName(client)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Phone className="h-3 w-3 mr-2" />
                    {client.phone}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-2" />
                  {format(client.dob, "d MMMM yyyy", { locale: ru })}
                </div>
              </div>
            ))}
            
            {filteredClients.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Клиенты не найдены</p>
                <Button onClick={onCreateNew}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Создать нового клиента
                </Button>
              </div>
            )}
          </div>
          
          {filteredClients.length > 0 && (
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>Отмена</Button>
              <Button onClick={onCreateNew}>
                <UserPlus className="mr-2 h-4 w-4" />
                Создать нового клиента
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
