
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { clientsData } from "./types";

interface ClientSearchFieldProps {
  value: number | undefined;
  onChange: (clientId: number) => void;
  onCreateNew: () => void;
}

export function ClientSearchField({ value, onChange, onCreateNew }: ClientSearchFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<typeof clientsData>([]);
  
  // Установить начальное значение поиска, если уже выбран клиент
  useEffect(() => {
    if (value) {
      const client = clientsData.find(c => c.id === value);
      if (client) {
        setSearchQuery(`${client.lastName} ${client.firstName} ${client.patronymic}`);
      }
    }
  }, [value]);
  
  // Фильтрация клиентов по поисковому запросу
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients([]);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = clientsData.filter(
        (client) =>
          `${client.lastName} ${client.firstName} ${client.patronymic}`
            .toLowerCase()
            .includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery]);
  
  // Выбор клиента из списка
  const handleSelectClient = (clientId: number) => {
    onChange(clientId);
    setSearchQuery(
      clientsData.find((c) => c.id === clientId)
        ? `${clientsData.find((c) => c.id === clientId)?.lastName} ${
            clientsData.find((c) => c.id === clientId)?.firstName
          } ${clientsData.find((c) => c.id === clientId)?.patronymic}`
        : ""
    );
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Поиск клиента</FormLabel>
      <div className="relative">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Поиск по ФИО..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">Клиент не найден</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={onCreateNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать нового клиента
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredClients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.lastName} ${client.firstName} ${client.patronymic}`}
                  onSelect={() => handleSelectClient(client.id)}
                >
                  {client.lastName} {client.firstName} {client.patronymic}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </FormItem>
  );
}
