
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
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { clientsData } from "./types";

interface ClientSearchFieldProps {
  value?: number;
  onChange: (value: number) => void;
  onCreateNew: () => void;
  isEditing?: boolean;
}

export function ClientSearchField({ value, onChange, onCreateNew, isEditing = false }: ClientSearchFieldProps) {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  // Find and set the selected client based on the value
  useEffect(() => {
    if (value) {
      const client = clientsData.find(client => client.id === value);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [value]);

  return (
    <FormField
      name="clientId"
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel>Клиент {isEditing && selectedClient ? `(${selectedClient.lastName} ${selectedClient.firstName} ${selectedClient.patronymic})` : ""}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between"
                disabled={isEditing && !open} // Disable button in edit mode unless opened
              >
                {value && selectedClient
                  ? `${selectedClient.lastName} ${selectedClient.firstName} ${selectedClient.patronymic}`
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
                <CommandGroup>
                  {clientsData && clientsData.length > 0 ? (
                    clientsData.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.id.toString()}
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
                    ))
                  ) : (
                    <CommandItem value="no-clients">
                      Нет доступных клиентов
                    </CommandItem>
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
