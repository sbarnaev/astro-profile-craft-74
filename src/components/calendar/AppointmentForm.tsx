
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExistingClientForm } from "./appointment-form/ExistingClientForm";
import { NewClientTab } from "./appointment-form/NewClientTab";
import { AppointmentFormProps } from "./appointment-form/types";

export function AppointmentForm({
  isOpen,
  onClose,
  initialDate,
  initialTime,
  onSubmit,
  initialClient,
}: AppointmentFormProps) {
  const [activeTab, setActiveTab] = useState<string>("existing");
  
  // Set active tab to "existing" when initialClient is provided
  useEffect(() => {
    if (initialClient) {
      setActiveTab("existing");
    }
  }, [initialClient]);
  
  // Обработка события создания нового клиента
  const handleCreateNewClient = (clientData: any) => {
    console.log("Создан новый клиент:", clientData);
    // Здесь должен быть API-запрос на создание клиента
    // и получение его ID, затем установка ID в форму
    // Для примера просто закрываем форму клиента
    setActiveTab("existing");
  };
  
  const handleCreateNew = () => {
    setActiveTab("new");
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
            <ExistingClientForm 
              initialDate={initialDate} 
              initialTime={initialTime} 
              onSubmit={onSubmit} 
              onClose={onClose} 
              onCreateNew={handleCreateNew}
              initialClient={initialClient} 
            />
          </TabsContent>
          
          <TabsContent value="new" className="py-4">
            <NewClientTab onCreateClient={handleCreateNewClient} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
