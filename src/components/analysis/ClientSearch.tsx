
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClientSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (client: any) => void;
  onCreateNew: () => void;
}

export function ClientSearch({ isOpen, onClose, onSelect, onCreateNew }: ClientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Загрузка клиентов из Supabase
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clientsSearch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Ошибка при загрузке клиентов:', error);
        return [];
      }
      
      return data.map(client => ({
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        patronymic: client.patronymic || "",
        dob: new Date(client.dob),
        phone: client.phone,
        email: client.email || "",
      }));
    }
  });
  
  // Фильтрация клиентов по поисковому запросу
  const filteredClients = clients.filter(client => {
    if (!searchQuery.trim()) return true;
    
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
            {isLoading ? (
              <div className="flex justify-center items-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
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
              ))
            ) : (
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
