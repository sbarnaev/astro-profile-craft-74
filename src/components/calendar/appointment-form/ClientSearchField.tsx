
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { clientsData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ClientSearchFieldProps {
  value?: number;
  onChange: (value: number) => void;
  onCreateNew: () => void;
  isEditing?: boolean;
  required?: boolean;
}

export function ClientSearchField({ 
  value, 
  onChange, 
  onCreateNew, 
  isEditing = false,
  required = false 
}: ClientSearchFieldProps) {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Fetch real clients from Supabase
  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching clients:', error);
          return;
        }
        
        if (data) {
          const formattedClients = data.map(client => ({
            id: client.id,
            firstName: client.first_name,
            lastName: client.last_name,
            patronymic: client.patronymic || '',
            phone: client.phone,
            email: client.email || ''
          }));
          setClients(formattedClients);
        }
      } catch (error) {
        console.error('Error in client fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, [user]);
  
  // Make sure we have valid client data to work with
  const safeClientsData = Array.isArray(clients) && clients.length > 0 
    ? clients 
    : Array.isArray(clientsData) ? clientsData : [];
  
  // Find and set the selected client based on the value
  useEffect(() => {
    if (value) {
      const client = safeClientsData.find(client => client && client.id === value);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [value, safeClientsData]);

  // Make sure we have a valid client name to display
  const getClientDisplayName = () => {
    if (selectedClient) {
      return `${selectedClient.lastName || ''} ${selectedClient.firstName || ''} ${selectedClient.patronymic || ''}`.trim();
    }
    return "Выберите клиента...";
  };

  return (
    <FormField
      name="clientId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{required && <span className="text-destructive mr-1">*</span>}Клиент {isEditing && selectedClient ? `(${selectedClient.lastName} ${selectedClient.firstName} ${selectedClient.patronymic})` : ""}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "justify-between",
                  required && !value && "border-destructive"
                )}
                disabled={isEditing && !open} // Disable button in edit mode unless opened
              >
                {value && selectedClient
                  ? getClientDisplayName()
                  : "Выберите клиента..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Найти клиента..." />
                <CommandEmpty>
                  <div className="p-2 text-center">
                    <p className="text-sm text-muted-foreground">Клиент не найден</p>
                    <Button variant="outline" size="sm" onClick={onCreateNew} className="mt-2">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Создать нового клиента
                    </Button>
                  </div>
                </CommandEmpty>
                
                {safeClientsData.length > 0 ? (
                  <CommandGroup>
                    {safeClientsData.map((client, index) => {
                      // Ensure client is not null or undefined before rendering
                      if (!client) return null;
                      
                      return (
                        <CommandItem
                          key={`${client.id || index}`}
                          value={client.id?.toString() || `client-${index}`}
                          onSelect={() => {
                            onChange(client.id);
                            setSelectedClient(client);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === client.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {client.lastName} {client.firstName} {client.patronymic}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      "Список клиентов пуст"
                    )}
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          {required && !value && (
            <FormMessage>Выберите клиента</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
