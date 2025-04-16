
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDeepSeekAI } from "@/hooks/useDeepSeekAI";
import { Loader2, RefreshCw, BookOpen, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIAnalysisViewProps {
  clientData: {
    id: string;
    clientName: string;
    firstName: string;
    lastName: string;
    personality_code?: number | string;
    connector_code?: number | string;
    realization_code?: number | string;
    generator_code?: number | string;
    mission_code?: number | string;
  };
  analysisType: 'full' | 'brief' | 'relationship';
  partnerData?: {
    id: string;
    clientName: string;
    firstName: string;
    lastName: string;
    personality_code?: number | string;
    connector_code?: number | string;
  };
  onAnalysisGenerated?: (analysis: string) => void;
}

export const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({
  clientData,
  analysisType,
  partnerData,
  onAnalysisGenerated
}) => {
  // В реальном приложении этот ключ должен храниться в защищенном месте (например, в Supabase secrets)
  const apiKey = "sk-422ceaf1fee445e7829eabbecd4fe509";
  
  const { loading, generatePersonalityAnalysis, generateCompatibilityAnalysis } = useDeepSeekAI(apiKey);
  const [analysis, setAnalysis] = useState<string>("");
  const [editableAnalysis, setEditableAnalysis] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();

  // Генерация анализа при загрузке компонента
  useEffect(() => {
    generateAnalysis();
  }, [clientData.id, analysisType, partnerData?.id]);

  const generateAnalysis = async () => {
    let result: string | null;
    
    if (analysisType === 'relationship' && partnerData) {
      result = await generateCompatibilityAnalysis(
        {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          personality_code: clientData.personality_code,
          connector_code: clientData.connector_code
        },
        {
          firstName: partnerData.firstName,
          lastName: partnerData.lastName,
          personality_code: partnerData.personality_code,
          connector_code: partnerData.connector_code
        }
      );
    } else {
      result = await generatePersonalityAnalysis(
        {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          personality_code: clientData.personality_code,
          connector_code: clientData.connector_code,
          realization_code: clientData.realization_code,
          generator_code: clientData.generator_code,
          mission_code: clientData.mission_code
        },
        analysisType
      );
    }

    if (result) {
      setAnalysis(result);
      setEditableAnalysis(result);
      if (onAnalysisGenerated) {
        onAnalysisGenerated(result);
      }
    }
  };

  const handleSaveEdit = () => {
    setAnalysis(editableAnalysis);
    setIsEditing(false);
    toast({
      title: "Изменения сохранены",
      description: "Отредактированный анализ сохранен успешно"
    });
    
    if (onAnalysisGenerated) {
      onAnalysisGenerated(editableAnalysis);
    }
  };

  const formatAnalysisText = (text: string) => {
    // Разбиваем текст на параграфы
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Проверяем, является ли параграф заголовком
      if (paragraph.startsWith('#') || paragraph.toUpperCase() === paragraph) {
        return <h3 key={index} className="font-bold text-lg mt-4 mb-2">{paragraph.replace(/^#+\s/, '')}</h3>;
      }
      
      // Обычный параграф
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {analysisType === 'full' && 'Полный AI-анализ личности'}
            {analysisType === 'brief' && 'Краткий AI-анализ личности'}
            {analysisType === 'relationship' && 'AI-анализ совместимости'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateAnalysis} 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Обновить
          </Button>
        </CardTitle>
        <CardDescription>
          {analysisType === 'relationship' && partnerData
            ? `Анализ совместимости ${clientData.clientName} и ${partnerData.clientName}`
            : `AI-анализ на основе личностных кодов ${clientData.clientName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Генерация AI-анализа...</p>
          </div>
        ) : (
          <Tabs defaultValue="view">
            <TabsList className="mb-4">
              <TabsTrigger value="view" onClick={() => setIsEditing(false)}>
                <BookOpen className="h-4 w-4 mr-2" />
                Просмотр
              </TabsTrigger>
              <TabsTrigger value="edit" onClick={() => setIsEditing(true)}>
                <Save className="h-4 w-4 mr-2" />
                Редактирование
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="prose max-w-none dark:prose-invert">
              {analysis ? (
                <div className="text-foreground">{formatAnalysisText(analysis)}</div>
              ) : (
                <p className="text-muted-foreground italic">Анализ пока не сгенерирован</p>
              )}
            </TabsContent>
            
            <TabsContent value="edit">
              <Textarea 
                value={editableAnalysis}
                onChange={(e) => setEditableAnalysis(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
