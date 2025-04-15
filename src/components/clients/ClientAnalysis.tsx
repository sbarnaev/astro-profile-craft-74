import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FileText, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalysisView } from "@/components/analysis/AnalysisView";

// Пример данных об анализах
const analysisData = [
  { 
    id: "1",
    clientId: "1",
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
    id: "2",
    clientId: "1",
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
    id: "3",
    clientId: "1",
    clientName: "Иванов Иван",
    clientPhone: "+7 (900) 123-45-67",
    clientDob: new Date(1990, 5, 15),
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
  { 
    id: "4",
    clientId: "2",
    clientName: "Петрова Анна",
    clientPhone: "+7 (900) 987-65-43",
    clientDob: new Date(1985, 8, 20),
    date: new Date(2025, 2, 15),
    type: "full",
    status: "completed",
    title: "Полный анализ личности",
    codes: {
      personality: "1/2",
      connector: "3/5",
      implementation: "6/4",
      generator: "4/2",
      mission: "2/3"
    }
  },
];

interface ClientAnalysisProps {
  clientId: string;
}

export const ClientAnalysis = ({ clientId }: ClientAnalysisProps) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  
  // Фильтрация анализов для текущего клиента и сортировка по дате
  const clientAnalyses = analysisData
    .filter(analysis => analysis.clientId === clientId)
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Сортировка по дате (сначала новые)
  
  const formatAnalysisDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: ru });
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

  if (selectedAnalysis) {
    return (
      <AnalysisView 
        analysis={selectedAnalysis} 
        onBack={() => setSelectedAnalysis(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none">
        <CardHeader className="pb-2">
          <CardTitle>История анализов</CardTitle>
          <CardDescription>
            Все проведенные анализы личности клиента
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientAnalyses.length > 0 ? (
            <div className="space-y-4">
              {clientAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedAnalysis(analysis)}>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{analysis.title}</span>
                      <Badge variant="outline" className={getAnalysisTypeColor(analysis.type)}>
                        {getAnalysisTypeLabel(analysis.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{formatAnalysisDate(analysis.date)}</span>
                    </div>
                    {analysis.type === "full" && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Личность:</span>{" "}
                          <span className="font-semibold">{analysis.codes.personality}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Коннектор:</span>{" "}
                          <span className="font-semibold">{analysis.codes.connector}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Реализация:</span>{" "}
                          <span className="font-semibold">{analysis.codes.implementation}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Генератор:</span>{" "}
                          <span className="font-semibold">{analysis.codes.generator}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Миссия:</span>{" "}
                          <span className="font-semibold">{analysis.codes.mission}</span>
                        </div>
                      </div>
                    )}
                    {analysis.type === "brief" && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Личность:</span>{" "}
                          <span className="font-semibold">{analysis.codes.personality}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Коннектор:</span>{" "}
                          <span className="font-semibold">{analysis.codes.connector}</span>
                        </div>
                      </div>
                    )}
                    {analysis.type === "relationship" && analysis.partnerName && (
                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Партнер:</span>{" "}
                          <span className="font-medium">{analysis.partnerName}</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <span className="text-sm text-muted-foreground">Совместимость:</span>{" "}
                            <span className="font-semibold">{analysis.codes.compatibility}</span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Сложности:</span>{" "}
                            <span className="font-semibold">{analysis.codes.challenges}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnalysis(analysis);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      Просмотр
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет анализов</h3>
              <p className="text-muted-foreground mb-6">
                Для этого клиента пока не проведено ни одного анализа
              </p>
              <Button asChild>
                <Link to={`/analysis/new?client=${clientId}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Новый анализ
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
