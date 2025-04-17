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
import { AIAnalysisView } from "@/components/analysis/AIAnalysisView";
import { Badge as BadgeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Пример данных об анализах
const analysisData = [
  { 
    id: 1,
    clientId: 1,
    clientName: "Иванов Иван",
    firstName: "Иван",
    lastName: "Иванов",
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
    },
    personality_code: "3/5",
    connector_code: "2/1",
    realization_code: "4/6",
    generator_code: "1/3",
    mission_code: "5/2"
  },
  { 
    id: 2,
    clientId: 1,
    clientName: "Иванов Иван",
    firstName: "Иван",
    lastName: "Иванов",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
    date: new Date(2025, 1, 15),
    type: "brief",
    status: "completed",
    title: "Краткий анализ потенциала",
    codes: {
      personality: "3/5",
      connector: "2/1",
    },
    personality_code: "3/5",
    connector_code: "2/1"
  },
  { 
    id: 3,
    clientId: 2,
    clientName: "Петрова Анна",
    firstName: "Анна",
    lastName: "Петрова",
    clientPhone: "+7 (900) 987-65-43",
    clientDob: new Date(1985, 8, 20),
    date: new Date(2025, 0, 5),
    type: "relationship",
    status: "completed",
    title: "Анализ совместимости",
    partnerName: "Иван Петров",
    partner: {
      id: "partner1",
      clientName: "Иван Петров",
      firstName: "Иван",
      lastName: "Петров",
      personality_code: "2/4",
      connector_code: "3/5"
    },
    codes: {
      compatibility: "75%",
      challenges: "25%"
    },
    personality_code: "3/5",
    connector_code: "2/1"
  },
];

const Analysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"standard" | "ai">("standard");
  const [showAnalysisSheet, setShowAnalysisSheet] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  
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

  const handleAnalysisGenerated = (analysisText: string) => {
    console.log("AI Analysis generated:", analysisText.substring(0, 100) + "...");
    // Здесь можно сохранить анализ в базу данных или выполнить другие действия
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {selectedAnalysis ? (
        <div>
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedAnalysis(null)}
              className="mr-4"
            >
              ← Назад к списку
            </Button>
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "standard" | "ai")}>
              <TabsList>
                <TabsTrigger value="standard">Стандартный анализ</TabsTrigger>
                <TabsTrigger value="ai">AI анализ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <AnalysisView 
                  analysis={selectedAnalysis} 
                  onBack={() => setSelectedAnalysis(null)} 
                />
              </TabsContent>
              
              <TabsContent value="ai">
                <AIAnalysisView
                  clientData={selectedAnalysis}
                  analysisType={selectedAnalysis.type}
                  partnerData={selectedAnalysis.partner}
                  onAnalysisGenerated={handleAnalysisGenerated}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Анализы личности</h1>
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
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="font-medium text-lg">{analysis.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(analysis.clientDob, "d MMMM yyyy", { locale: ru })}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Личность:</span>{" "}
                        <span className="font-medium">{analysis.codes.personality}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Коннектор:</span>{" "}
                        <span className="font-medium">{analysis.codes.connector}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Реализация:</span>{" "}
                        <span className="font-medium">{analysis.codes.implementation}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Генератор:</span>{" "}
                        <span className="font-medium">{analysis.codes.generator}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Миссия:</span>{" "}
                        <span className="font-medium">{analysis.codes.mission}</span>
                      </div>
                    </div>
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
