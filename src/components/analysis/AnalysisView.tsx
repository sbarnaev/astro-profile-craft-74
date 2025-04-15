
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calculator, Calendar, Save, FileText, User, Users, Banknote, Heart, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AnalysisViewProps {
  analysis: any;
  onBack: () => void;
}

export function AnalysisView({ analysis, onBack }: AnalysisViewProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [notes, setNotes] = useState({
    basic: "",
    archetypes: "",
    summary: "",
    finance: "",
    relationships: ""
  });

  const handleSaveNote = (tab: string, content: string) => {
    setNotes({
      ...notes,
      [tab]: content
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{analysis.title}</h1>
          <p className="text-muted-foreground">
            {analysis.clientName} • {format(analysis.date, "d MMMM yyyy", { locale: ru })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка - данные клиента и результаты расчета */}
        <div className="md:col-span-1 space-y-6">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Информация о клиенте</CardTitle>
              <CardDescription>Данные для расчета</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ФИО:</span>
                <span className="font-medium">{analysis.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Телефон:</span>
                <span className="font-medium">{analysis.clientPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Дата рождения:</span>
                <span className="font-medium">
                  {format(analysis.clientDob, "d MMMM yyyy", { locale: ru })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Результаты расчета</CardTitle>
              <CardDescription>Основные коды личности</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {analysis.codes.personality && (
                  <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код личности</span>
                    <span className="text-2xl font-bold">{analysis.codes.personality}</span>
                  </div>
                )}
                {analysis.codes.connector && (
                  <div className="flex flex-col items-center justify-center p-3 bg-secondary/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код коннектора</span>
                    <span className="text-2xl font-bold">{analysis.codes.connector}</span>
                  </div>
                )}
                {analysis.codes.implementation && (
                  <div className="flex flex-col items-center justify-center p-3 bg-accent/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код реализации</span>
                    <span className="text-2xl font-bold">{analysis.codes.implementation}</span>
                  </div>
                )}
                {analysis.codes.generator && (
                  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                    <span className="text-xs text-muted-foreground">Код генератора</span>
                    <span className="text-2xl font-bold">{analysis.codes.generator}</span>
                  </div>
                )}
                {analysis.codes.mission && (
                  <div className="col-span-2 flex flex-col items-center justify-center p-3 bg-primary/20 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код миссии</span>
                    <span className="text-2xl font-bold">{analysis.codes.mission}</span>
                  </div>
                )}
                {analysis.codes.compatibility && (
                  <div className="flex flex-col items-center justify-center p-3 bg-green-100 rounded-lg">
                    <span className="text-xs text-muted-foreground">Совместимость</span>
                    <span className="text-2xl font-bold">{analysis.codes.compatibility}</span>
                  </div>
                )}
                {analysis.codes.challenges && (
                  <div className="flex flex-col items-center justify-center p-3 bg-orange-100 rounded-lg">
                    <span className="text-xs text-muted-foreground">Сложности</span>
                    <span className="text-2xl font-bold">{analysis.codes.challenges}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка - вкладки анализа */}
        <div className="md:col-span-2">
          <Card className="astro-card border-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Профиль личности</CardTitle>
              <CardDescription>Анализ по ключевым аспектам</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="basic" className="text-xs sm:text-sm">
                    <FileText className="h-4 w-4 mr-1 hidden sm:block" />
                    Базовый
                  </TabsTrigger>
                  <TabsTrigger value="archetypes" className="text-xs sm:text-sm">
                    <User className="h-4 w-4 mr-1 hidden sm:block" />
                    Архетипы
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="text-xs sm:text-sm">
                    <FileText className="h-4 w-4 mr-1 hidden sm:block" />
                    Саммари
                  </TabsTrigger>
                  <TabsTrigger value="finance" className="text-xs sm:text-sm">
                    <Banknote className="h-4 w-4 mr-1 hidden sm:block" />
                    Финансы
                  </TabsTrigger>
                  <TabsTrigger value="relationships" className="text-xs sm:text-sm">
                    <Heart className="h-4 w-4 mr-1 hidden sm:block" />
                    Отношения
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Базовый анализ</h3>
                    <div className="space-y-4">
                      {analysis.codes.personality && (
                        <p>Личность с кодом <strong>{analysis.codes.personality}</strong> обладает следующими характеристиками...</p>
                      )}
                      {analysis.codes.connector && analysis.codes.implementation && (
                        <p>В сочетании с кодом коннектора <strong>{analysis.codes.connector}</strong> и кодом реализации <strong>{analysis.codes.implementation}</strong>, 
                        вы можете наблюдать следующие проявления личности...</p>
                      )}
                      <textarea
                        className="w-full h-40 p-3 rounded-md border border-border bg-background"
                        placeholder="Заметки по базовому анализу..."
                        value={notes.basic}
                        onChange={(e) => handleSaveNote("basic", e.target.value)}
                      />
                      <Button size="sm" className="mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить заметки
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="archetypes" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Атлас архетипов</h3>
                    <div className="space-y-4">
                      {analysis.codes.personality && (
                        <p>Доминирующие архетипы для кода личности <strong>{analysis.codes.personality}</strong>...</p>
                      )}
                      <p>Скрытые архетипы и их влияние...</p>
                      <textarea
                        className="w-full h-40 p-3 rounded-md border border-border bg-background"
                        placeholder="Заметки по архетипам..."
                        value={notes.archetypes}
                        onChange={(e) => handleSaveNote("archetypes", e.target.value)}
                      />
                      <Button size="sm" className="mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить заметки
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Аналогичный контент для других вкладок */}
                <TabsContent value="summary" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Саммари</h3>
                    <div className="space-y-4">
                      <p>Общее резюме по всем аспектам личности...</p>
                      <textarea
                        className="w-full h-40 p-3 rounded-md border border-border bg-background"
                        placeholder="Заметки по саммари..."
                        value={notes.summary}
                        onChange={(e) => handleSaveNote("summary", e.target.value)}
                      />
                      <Button size="sm" className="mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить заметки
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="finance" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Финансовый профиль</h3>
                    <div className="space-y-4">
                      {analysis.codes.personality && analysis.codes.generator && (
                        <p>Финансовые особенности и потенциал для кодов {analysis.codes.personality}/{analysis.codes.generator}...</p>
                      )}
                      <textarea
                        className="w-full h-40 p-3 rounded-md border border-border bg-background"
                        placeholder="Заметки по финансам..."
                        value={notes.finance}
                        onChange={(e) => handleSaveNote("finance", e.target.value)}
                      />
                      <Button size="sm" className="mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить заметки
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="relationships" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Отношения</h3>
                    <div className="space-y-4">
                      {analysis.codes.personality && analysis.codes.connector && (
                        <p>Особенности в отношениях для кодов {analysis.codes.personality}/{analysis.codes.connector}...</p>
                      )}
                      <textarea
                        className="w-full h-40 p-3 rounded-md border border-border bg-background"
                        placeholder="Заметки по отношениям..."
                        value={notes.relationships}
                        onChange={(e) => handleSaveNote("relationships", e.target.value)}
                      />
                      <Button size="sm" className="mt-2">
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить заметки
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
