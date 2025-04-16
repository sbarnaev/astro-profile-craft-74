
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientSessions } from "@/components/clients/ClientSessions";
import { ClientReminders } from "@/components/clients/ClientReminders";

interface ClientDetailsTabsProps {
  clientId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ClientDetailsTabs = ({ clientId, activeTab, setActiveTab }: ClientDetailsTabsProps) => {
  // Convert clientId to number for components that expect it as a number
  const clientIdNumber = parseInt(clientId, 10);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 w-full mb-4">
        <TabsTrigger value="consultations">Сессии</TabsTrigger>
        <TabsTrigger value="reminders">Напоминания</TabsTrigger>
      </TabsList>

      <TabsContent value="consultations" className="space-y-6">
        <ClientSessions clientId={clientIdNumber} />
      </TabsContent>

      <TabsContent value="reminders" className="space-y-6">
        <ClientReminders clientId={clientIdNumber} />
      </TabsContent>
    </Tabs>
  );
};
