
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Calendar, Save, FileText, User, Users, Banknote, Heart } from "lucide-react";
import { calculatePersonalityCodes } from "@/lib/calculations";

type PersonalityCodes = {
  personalityCode: number;
  connectorCode: number;
  realizationCode: number;
  generatorCode: number;
  missionCode: number | string;
};

const Analysis = () => {
  const [birthDate, setBirthDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [personalityCodes, setPersonalityCodes] = useState<PersonalityCodes | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [notes, setNotes] = useState({
    basic: "",
    archetypes: "",
    summary: "",
    finance: "",
    relationships: ""
  });

  const handleCalculate = () => {
    if (!birthDate) return;
    
    const codes = calculatePersonalityCodes(birthDate);
    setPersonalityCodes(codes);
  };

  const handleSaveNote = (tab: string, content: string) => {
    setNotes({
      ...notes,
      [tab]: content
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Анализ личности</h1>
        <p className="text-muted-foreground">Расчет личностного профиля клиента</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка - ввод данных и результаты расчета */}
        <div className="md:col-span-1 space-y-6">
          <Card className="astro-card border-none">
            <CardHeader className="pb-2">
              <CardTitle>Данные клиента</CardTitle>
              <CardDescription>Введите информацию для расчета</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Имя клиента</Label>
                <Input
                  id="client-name"
                  placeholder="Введите имя"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth-date">Дата рождения</Label>
                <Input
                  id="birth-date"
                  type="date"
                  placeholder="ДД.ММ.ГГГГ"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCalculate}
                disabled={!birthDate}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Рассчитать
              </Button>
            </CardContent>
          </Card>

          {personalityCodes && (
            <Card className="astro-card border-none">
              <CardHeader className="pb-2">
                <CardTitle>Результаты расчета</CardTitle>
                <CardDescription>Основные коды личности</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код личности</span>
                    <span className="text-2xl font-bold">{personalityCodes.personalityCode}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-secondary/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код коннектора</span>
                    <span className="text-2xl font-bold">{personalityCodes.connectorCode}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-accent/10 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код реализации</span>
                    <span className="text-2xl font-bold">{personalityCodes.realizationCode}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                    <span className="text-xs text-muted-foreground">Код генератора</span>
                    <span className="text-2xl font-bold">{personalityCodes.generatorCode}</span>
                  </div>
                  <div className="col-span-2 flex flex-col items-center justify-center p-3 bg-primary/20 rounded-lg">
                    <span className="text-xs text-muted-foreground">Код миссии</span>
                    <span className="text-2xl font-bold">{personalityCodes.missionCode}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                    {personalityCodes ? (
                      <div className="space-y-4">
                        <p>Личность с кодом <strong>{personalityCodes.personalityCode}</strong> обладает следующими характеристиками...</p>
                        <p>В сочетании с кодом коннектора <strong>{personalityCodes.connectorCode}</strong> и кодом реализации <strong>{personalityCodes.realizationCode}</strong>, 
                        вы можете наблюдать следующие проявления личности...</p>
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
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Введите дату рождения клиента и нажмите "Рассчитать"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="archetypes" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Атлас архетипов</h3>
                    {personalityCodes ? (
                      <div className="space-y-4">
                        <p>Доминирующие архетипы для кода личности <strong>{personalityCodes.personalityCode}</strong>...</p>
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
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Введите дату рождения клиента и нажмите "Рассчитать"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Аналогичный контент для других вкладок */}
                <TabsContent value="summary" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Саммари</h3>
                    {personalityCodes ? (
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
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Введите дату рождения клиента и нажмите "Рассчитать"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="finance" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Финансовый профиль</h3>
                    {personalityCodes ? (
                      <div className="space-y-4">
                        <p>Финансовые особенности и потенциал для кодов {personalityCodes.personalityCode}/{personalityCodes.generatorCode}...</p>
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
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Banknote className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Введите дату рождения клиента и нажмите "Рассчитать"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="relationships" className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 min-h-[300px]">
                    <h3 className="text-lg font-medium mb-2">Отношения</h3>
                    {personalityCodes ? (
                      <div className="space-y-4">
                        <p>Особенности в отношениях для кодов {personalityCodes.personalityCode}/{personalityCodes.connectorCode}...</p>
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
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Введите дату рождения клиента и нажмите "Рассчитать"</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
