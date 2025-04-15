
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Search, Plus, User, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientSearch } from "@/components/analysis/ClientSearch";
import { AnalysisView } from "@/components/analysis/AnalysisView";
import { Badge as BadgeIcon } from "lucide-react";

// Пример данных об анализах
const analysisData = [
  { 
    id: 1,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 2, 2),
    type: "full",
    status: "completed",
    title: "Полный анализ личности",
    codes: {
      personality: "3/5",
      connector: "2/1",
      implementation: "4/6",
      generator: "1/3",
      mission: "5/2"
    }
  },
  { 
    id: 2,
    clientId: 1,
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 1, 15),
    type: "brief",
    status: "completed",
    title: "Краткий анализ потенциала",
    codes: {
      personality: "3/5",
      connector: "2/1",
    }
  },
  { 
    id: 3,
    clientId: 2,
    clientName: "Петрова Анна",
    clientPhone: "+7 (900) 987-65-43",
    clientDob: new Date(1985, 8, 20),
    date: new Date(2025, 0, 5),
    type: "relationship",
    status: "completed",
    title: "Анализ совместимости",
    partnerName: "Иван Петров",
    codes: {
      compatibility: "75%",
      challenges: "25%"
    }
  },
];

const Analysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  
  // Фильтрация анализов по поисковому запросу
  const filteredAnalysis = analysisData.filter(analysis => {
    const query = searchQuery.toLowerCase();
    return (
      analysis.clientName.toLowerCase().includes(query) ||
      analysis.clientPhone.includes(query) ||
      format(analysis.clientDob, "dd.MM.yyyy").includes(query)
    );
  });
  
  const handleClientSelect = (client: any) => {
    setIsClientSearchOpen(false);
    // Здесь можно перенаправить на страницу создания анализа для выбранного клиента
    console.log("Selected client for analysis:", client);
  };
  
  const handleCreateClient = (data: any) => {
    setIsCreateDialogOpen(false);
    // Здесь можно создать клиента и затем перейти к созданию анализа
    console.log("New client created:", data);
  };
  
  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case "full":
        return "Полный анализ";
      case "brief":
        return "Краткий анализ";
      case "relationship":
        return "Анализ совместимости";
      default:
        return "Анализ";
    }
  };
  
  const getAnalysisTypeColor = (type: string) => {
    switch (type) {
      case "full":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "brief":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "relationship":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedAnalysis ? (
        <AnalysisView 
          analysis={selectedAnalysis} 
          onBack={() => setSelectedAnalysis(null)} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Анализы личности</h1>
            <Button onClick={() => setIsClientSearchOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Создать анализ
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по ФИО, телефону или дате рождения..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnalysis.map((analysis) => (
              <Card 
                key={analysis.id} 
                className="cursor-pointer hover:border-primary transition-all"
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge className={getAnalysisTypeColor(analysis.type)}>
                      {getAnalysisTypeLabel(analysis.type)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {format(analysis.date, "d MMMM yyyy", { locale: ru })}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{analysis.title}</CardTitle>
                  <CardDescription>{analysis.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <User className="mr-2 h-4 w-4" />
                    <span>{analysis.clientName}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>
                      {format(analysis.clientDob, "d MMMM yyyy", { locale: ru })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {analysis.type === "full" && (
                      <>
                        <Badge variant="outline" className="flex items-center">
                          <BadgeIcon className="mr-1 h-3 w-3" />
                          Личность: {analysis.codes.personality}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <BadgeIcon className="mr-1 h-3 w-3" />
                          Коннектор: {analysis.codes.connector}
                        </Badge>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredAnalysis.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Анализы не найдены</h3>
                <p className="text-muted-foreground mb-6">
                  По вашему запросу не найдено ни одного анализа
                </p>
                <Button onClick={() => setIsClientSearchOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать анализ
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Диалог поиска клиента */}
      <ClientSearch 
        isOpen={isClientSearchOpen} 
        onClose={() => setIsClientSearchOpen(false)}
        onSelect={handleClientSelect}
        onCreateNew={() => {
          setIsClientSearchOpen(false);
          setIsCreateDialogOpen(true);
        }}
      />
      
      {/* Диалог создания клиента */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создание нового клиента</DialogTitle>
          </DialogHeader>
          <ClientForm 
            onSubmit={handleCreateClient}
            showCodes={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analysis;
