
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Пример данных анализов
const analysisData = [
  { 
    id: 1, 
    clientName: "Анна Смирнова", 
    date: "14.04.1993", 
    createdAt: "02.03.2025", 
    type: "Полный анализ", 
    status: "completed" 
  },
  { 
    id: 2, 
    clientName: "Иван Петров", 
    date: "28.02.1985", 
    createdAt: "15.02.2025", 
    type: "Базовый анализ", 
    status: "completed" 
  },
  { 
    id: 3, 
    clientName: "Мария Иванова", 
    date: "10.10.1990", 
    createdAt: "10.04.2025", 
    type: "Консультация", 
    status: "pending" 
  },
  { 
    id: 4, 
    clientName: "Александр Козлов", 
    date: "05.07.1982", 
    createdAt: "01.04.2025", 
    type: "Полный анализ", 
    status: "in-progress" 
  },
  { 
    id: 5, 
    clientName: "Екатерина Новикова", 
    date: "22.12.1988", 
    createdAt: "05.03.2025", 
    type: "Совместимость", 
    status: "completed" 
  },
];

// Функция для отображения статуса
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Завершен
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          В работе
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          Ожидает
        </Badge>
      );
    default:
      return null;
  }
};

const Analysis = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Анализы</h1>
          <p className="text-muted-foreground">Анализы личности по дате рождения</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Новый анализ
        </Button>
      </div>

      <Card className="astro-card border-none">
        <CardHeader className="pb-2">
          <CardTitle>Все анализы</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="completed">Завершенные</TabsTrigger>
              <TabsTrigger value="in-progress">В работе</TabsTrigger>
              <TabsTrigger value="pending">Ожидающие</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="mb-4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Поиск по имени клиента..." 
                  className="pl-8"
                />
              </div>
              
              <div className="space-y-4">
                {analysisData.map((analysis) => (
                  <div 
                    key={analysis.id} 
                    className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="min-w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{analysis.clientName}</h3>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-x-4 text-sm text-muted-foreground">
                          <span>Дата рождения: {analysis.date}</span>
                          <span className="hidden xs:inline">•</span>
                          <span>Создан: {analysis.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-3 items-start xs:items-center ml-auto">
                      <span className="text-sm px-3 py-1 rounded-full bg-muted">
                        {analysis.type}
                      </span>
                      <StatusBadge status={analysis.status} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">Завершенные анализы</h3>
                <p className="text-muted-foreground">Здесь будут отображаться завершенные анализы</p>
              </div>
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-0">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">Анализы в работе</h3>
                <p className="text-muted-foreground">Здесь будут отображаться анализы в работе</p>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">Ожидающие анализы</h3>
                <p className="text-muted-foreground">Здесь будут отображаться ожидающие анализы</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;
