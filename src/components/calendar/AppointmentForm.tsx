
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse, addMinutes } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Search, Plus, Loader2, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ClientForm } from "@/components/clients/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Пример данных о клиентах
const clientsData = [
  { id: 1, firstName: "Анна", lastName: "Смирнова", patronymic: "Ивановна" },
  { id: 2, firstName: "Иван", lastName: "Петров", patronymic: "Сергеевич" },
  { id: 3, firstName: "Мария", lastName: "Иванова", patronymic: "Александровна" },
  { id: 4, firstName: "Александр", lastName: "Козлов", patronymic: "Дмитриевич" },
  { id: 5, firstName: "Екатерина", lastName: "Новикова", patronymic: "Андреевна" },
];

// Типы консультаций
const consultationTypes = [
  { id: 1, name: "Экспресс-консультация", duration: 30, cost: 2000 },
  { id: 2, name: "Базовый анализ", duration: 60, cost: 3500 },
  { id: 3, name: "Отношения", duration: 90, cost: 5000 },
  { id: 4, name: "Целевой анализ", duration: 120, cost: 7000 },
];

// Схема формы
const formSchema = z.object({
  clientId: z.number().optional(),
  consultationType: z.number({
    required_error: "Выберите тип консультации",
  }),
  date: z.date({
    required_error: "Выберите дату консультации",
  }),
  time: z.string({
    required_error: "Выберите время консультации",
  }),
  request: z.string().optional(),
  cost: z.number().optional(),
});

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  initialTime?: string;
  onSubmit: (values: any) => void;
}

export function AppointmentForm({
  isOpen,
  onClose,
  initialDate,
  initialTime,
  onSubmit,
}: AppointmentFormProps) {
  const [showClientForm, setShowClientForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<typeof clientsData>([]);
  const [activeTab, setActiveTab] = useState<string>("existing");
  const [customCost, setCustomCost] = useState<number | null>(null);
  
  // Создаем форму
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialDate || new Date(),
      time: initialTime || "10:00",
      request: "",
      cost: 3500,
    },
  });
  
  // Update cost when consultation type changes
  useEffect(() => {
    const typeId = form.getValues().consultationType;
    if (typeId) {
      const selectedType = consultationTypes.find(type => type.id === typeId);
      if (selectedType && !customCost) {
        form.setValue("cost", selectedType.cost);
      }
    }
  }, [form.watch("consultationType")]);
  
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
    form.setValue("clientId", clientId);
    setSearchQuery(
      clientsData.find((c) => c.id === clientId)
        ? `${clientsData.find((c) => c.id === clientId)?.lastName} ${
            clientsData.find((c) => c.id === clientId)?.firstName
          } ${clientsData.find((c) => c.id === clientId)?.patronymic}`
        : ""
    );
  };
  
  // Часы работы (с 9:00 до 19:00 с интервалом 30 минут)
  const timeSlots = [];
  for (let i = 9; i < 19; i++) {
    timeSlots.push(`${i}:00`);
    timeSlots.push(`${i}:30`);
  }
  
  // Обработка события создания нового клиента
  const handleCreateNewClient = (clientData: any) => {
    console.log("Создан новый клиент:", clientData);
    // Здесь должен быть API-запрос на создание клиента
    // и получение его ID, затем установка ID в форму
    // Для примера просто закрываем форму клиента
    setShowClientForm(false);
    setActiveTab("existing");
    // Имитация установки ID нового клиента
    form.setValue("clientId", 999); // временное значение
    setSearchQuery(`${clientData.lastName} ${clientData.firstName} ${clientData.patronymic || ""}`);
  };
  
  // Обработка отправки формы
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    // Собираем полные данные для создания встречи
    const appointmentData = {
      ...values,
      // Преобразуем время и дату в объект Date
      appointmentDateTime: values.date
        ? parse(`${format(values.date, "yyyy-MM-dd")} ${values.time}`, "yyyy-MM-dd HH:mm", new Date())
        : null,
      duration: values.consultationType
        ? consultationTypes.find((type) => type.id === values.consultationType)?.duration || 60
        : 60,
      clientName: values.clientId
        ? `${clientsData.find((c) => c.id === values.clientId)?.lastName} ${
            clientsData.find((c) => c.id === values.clientId)?.firstName
          } ${clientsData.find((c) => c.id === values.clientId)?.patronymic}`
        : "Новый клиент",
      cost: values.cost || 3500
    };
    
    onSubmit(appointmentData);
    onClose();
  };
  
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setCustomCost(value);
      form.setValue("cost", value);
    } else {
      setCustomCost(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Запись на консультацию</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Существующий клиент</TabsTrigger>
            <TabsTrigger value="new">Новый клиент</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                              onClick={() => setActiveTab("new")}
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="consultationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип консультации</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип консультации" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {consultationTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.name} ({type.duration} мин)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Дата</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "d MMMM yyyy", { locale: ru })
                                ) : (
                                  <span>Выберите дату</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={ru}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Время</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите время" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-50">
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  
                  </FormField>
                  
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Стоимость</FormLabel>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="number"
                            placeholder="Стоимость"
                            className="pl-10"
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(parseInt(e.target.value) || 0);
                              handleCostChange(e);
                            }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="request"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Запрос клиента</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Опишите запрос клиента..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={!form.getValues().clientId}>
                    Создать встречу
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="new" className="py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Создание нового клиента</h3>
              <ClientForm 
                onSubmit={handleCreateNewClient} 
                showCodes={false} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
