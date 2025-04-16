
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Bell } from "lucide-react";
import { ClientConsultations } from "@/components/clients/ClientConsultations";
import { ClientReminders } from "@/components/clients/ClientReminders";

interface ClientDetailsTabsProps {
  clientId: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const ClientDetailsTabs = ({ clientId, activeTab, setActiveTab }: ClientDetailsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="consultations">
          <Calendar className="mr-2 h-4 w-4" />
          Консультации
        </TabsTrigger>
        <TabsTrigger value="reminders">
          <Bell className="mr-2 h-4 w-4" />
          Напоминания
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="consultations">
        <ClientConsultations clientId={parseInt(clientId)} />
      </TabsContent>
      
      <TabsContent value="reminders">
        <ClientReminders clientId={parseInt(clientId)} />
      </TabsContent>
    </Tabs>
  );
};
