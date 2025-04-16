
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Bell, FileText } from "lucide-react";
import { ClientConsultations } from "@/components/clients/ClientConsultations";
import { ClientReminders } from "@/components/clients/ClientReminders";
import { ClientAnalysis } from "@/components/clients/ClientAnalysis";

interface ClientDetailsTabsProps {
  clientId: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const ClientDetailsTabs = ({ clientId, activeTab, setActiveTab }: ClientDetailsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="consultations">
          <Calendar className="mr-2 h-4 w-4" />
          Консультации
        </TabsTrigger>
        <TabsTrigger value="reminders">
          <Bell className="mr-2 h-4 w-4" />
          Напоминания
        </TabsTrigger>
        <TabsTrigger value="analysis">
          <FileText className="mr-2 h-4 w-4" />
          Анализы
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="consultations">
        <ClientConsultations clientId={clientId} />
      </TabsContent>
      
      <TabsContent value="reminders">
        <ClientReminders clientId={clientId} />
      </TabsContent>
      
      <TabsContent value="analysis">
        <ClientAnalysis clientId={clientId} />
      </TabsContent>
    </Tabs>
  );
};
