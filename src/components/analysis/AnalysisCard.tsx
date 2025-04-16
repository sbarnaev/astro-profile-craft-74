
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  Calculator, Calendar, User, FileText, 
  Award, AlertCircle, BookOpen, Sparkles,
  Save, ChevronDown, ChevronUp, Edit
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { calculatePersonalityCodes, getArchetypeName } from "@/lib/calculations";
import { AnalysisType } from "@/types/sessions";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalysisCardProps {
  client: {
    id: number;
    name: string;
    phone: string;
    dob: Date;
  };
  analysis?: AnalysisType;
  onBack?: () => void;
}

export function AnalysisCard({ client, analysis, onBack }: AnalysisCardProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [notes, setNotes] = useState(analysis?.notes || "");
  const isMobile = useIsMobile();
  
  const birthDateString = format(client.dob, "yyyy-MM-dd");
  const codes = calculatePersonalityCodes(birthDateString);
  
  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  const handleSaveNotes = () => {
    console.log("Сохранение заметок:", notes);
    // Здесь будет логика сохранения заметок
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" size="icon" onClick={onBack}>
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">Анализ личности</h1>
          <p className="text-muted-foreground">
            {client.name} • {format(client.dob, "d MMMM yyyy", { locale: ru })}
          </p>
        </div>
      </div>

      <div className="space-y-6 w-full">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Информация о клиенте</CardTitle>
            <CardDescription>Данные для расчета</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">ФИО:</span>
              </div>
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Дата рождения:</span>
              </div>
              <span className="font-medium">
                {format(client.dob, "d MMMM yyyy", { locale: ru })}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Телефон:</span>
              </div>
              <span className="font-medium">{client.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Коды личности</CardTitle>
            <CardDescription>Основные архетипы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-primary/10 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Код личности</span>
                  <span className="text-xl font-bold">{codes.personalityCode}</span>
                </div>
                <div className="mt-1 sm:mt-0 sm:text-right">
                  <span className="text-sm font-medium">{getArchetypeName(codes.personalityCode)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-secondary/10 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Код коннектора</span>
                  <span className="text-xl font-bold">{codes.connectorCode}</span>
                </div>
                <div className="mt-1 sm:mt-0 sm:text-right">
                  <span className="text-sm font-medium">{getArchetypeName(codes.connectorCode)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-accent/10 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Код реализации</span>
                  <span className="text-xl font-bold">{codes.realizationCode}</span>
                </div>
                <div className="mt-1 sm:mt-0 sm:text-right">
                  <span className="text-sm font-medium">{getArchetypeName(codes.realizationCode)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-muted rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Код генератора</span>
                  <span className="text-xl font-bold">{codes.generatorCode}</span>
                </div>
                <div className="mt-1 sm:mt-0 sm:text-right">
                  <span className="text-sm font-medium">{getArchetypeName(codes.generatorCode)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-primary/20 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Код миссии</span>
                  <span className="text-xl font-bold">{codes.missionCode}</span>
                </div>
                <div className="mt-1 sm:mt-0 sm:text-right">
                  <span className="text-sm font-medium">{getArchetypeName(codes.missionCode)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Краткое саммари</CardTitle>
            <CardDescription>Общая характеристика личности</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="mb-2">Личность с кодом {codes.personalityCode} ({getArchetypeName(codes.personalityCode)}) и кодом коннектора {codes.connectorCode} ({getArchetypeName(codes.connectorCode)}) характеризуется следующими качествами:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Стремление к {codes.personalityCode === 1 ? "лидерству и самостоятельности" : "гармонии и сотрудничеству"}</li>
                <li>Взаимодействие с окружающими преимущественно через {codes.connectorCode === 3 ? "креативность и самовыражение" : "структуру и организацию"}</li>
                <li>Основной путь реализации через {getArchetypeName(codes.realizationCode).toLowerCase()}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 justify-start w-full mb-4">
          <Button 
            variant={openSection === "decoding" ? "default" : "outline"}
            onClick={() => toggleSection("decoding")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Расшифровка
          </Button>
          <Button 
            variant={openSection === "conflicts" ? "default" : "outline"}
            onClick={() => toggleSection("conflicts")}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Конфликты
          </Button>
          <Button 
            variant={openSection === "archetypes" ? "default" : "outline"}
            onClick={() => toggleSection("archetypes")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Атлас архетипов
          </Button>
          <Button 
            variant={openSection === "summary" ? "default" : "outline"}
            onClick={() => toggleSection("summary")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Саммари
          </Button>
        </div>

        <div className="space-y-4">
          {openSection === "decoding" && (
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Детальная расшифровка кодов</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Код личности {codes.personalityCode} - {getArchetypeName(codes.personalityCode)}</h4>
                      <p className="text-muted-foreground mt-1">Основные черты характера, жизненные ценности и мотивация.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Код коннектора {codes.connectorCode} - {getArchetypeName(codes.connectorCode)}</h4>
                      <p className="text-muted-foreground mt-1">Стиль общения, способы взаимодействия с окружающими.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Код реализации {codes.realizationCode} - {getArchetypeName(codes.realizationCode)}</h4>
                      <p className="text-muted-foreground mt-1">Способы самореализации, карьера, достижение целей.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Код генератора {codes.generatorCode} - {getArchetypeName(codes.generatorCode)}</h4>
                      <p className="text-muted-foreground mt-1">Источники энергии, внутренние ресурсы, подсознательные паттерны.</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Код миссии {codes.missionCode} - {getArchetypeName(codes.missionCode)}</h4>
                      <p className="text-muted-foreground mt-1">Глобальные задачи, жизненное предназначение.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {openSection === "conflicts" && (
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Возможные внутренние конфликты</h3>
                  <p>Анализ потенциальных конфликтов между различными кодами личности и путей их разрешения.</p>
                  
                  <div className="space-y-2">
                    {codes.personalityCode !== codes.connectorCode && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 className="font-medium">Конфликт личности ({codes.personalityCode}) и коннектора ({codes.connectorCode})</h4>
                        <p className="text-sm text-muted-foreground">Противоречие между внутренними стремлениями и способами взаимодействия с миром.</p>
                      </div>
                    )}
                    
                    {codes.connectorCode !== codes.realizationCode && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <h4 className="font-medium">Конфликт коннектора ({codes.connectorCode}) и реализации ({codes.realizationCode})</h4>
                        <p className="text-sm text-muted-foreground">Разрыв между стилем общения и способами достижения целей.</p>
                      </div>
                    )}
                    
                    {codes.personalityCode !== codes.generatorCode && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <h4 className="font-medium">Конфликт личности ({codes.personalityCode}) и генератора ({codes.generatorCode})</h4>
                        <p className="text-sm text-muted-foreground">Несоответствие между осознанными желаниями и подсознательными энергетическими паттернами.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {openSection === "archetypes" && (
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Архетипы личности</h3>
                  <p>Детальное описание активных архетипов в структуре личности и их влияния.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <h4 className="font-medium">Архетип {getArchetypeName(codes.personalityCode)}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Доминирующий архетип, определяющий основу характера.</p>
                    </div>
                    
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h4 className="font-medium">Архетип {getArchetypeName(codes.connectorCode)}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Архетип социального взаимодействия и коммуникации.</p>
                    </div>
                    
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-medium">Архетип {getArchetypeName(codes.realizationCode)}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Архетип профессиональной и личностной реализации.</p>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium">Архетип {getArchetypeName(codes.generatorCode)}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Архетип энергетического ресурса и жизненных сил.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {openSection === "summary" && (
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Итоговое резюме</h3>
                  <p>Комплексная характеристика личности, учитывающая взаимодействие всех кодов и архетипов.</p>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="mb-3">
                      Основываясь на анализе кодов личности ({codes.personalityCode}, {codes.connectorCode}, {codes.realizationCode}, {codes.generatorCode}, {codes.missionCode}), 
                      можно сделать следующие выводы о характере и потенциале:
                    </p>
                    <ul className="list-disc ml-5 space-y-2">
                      <li>Ключевые качества: {getQualitiesForCode(codes.personalityCode)}</li>
                      <li>Стиль коммуникации: {getQualitiesForCode(codes.connectorCode)}</li>
                      <li>Таланты и способности: {getQualitiesForCode(codes.realizationCode)}</li>
                      <li>Внутренние ресурсы: {getQualitiesForCode(codes.generatorCode)}</li>
                      <li>Жизненная задача: {getQualitiesForCode(codes.missionCode)}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-6 w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Заметки</CardTitle>
              <Button size="sm" variant="outline" onClick={handleSaveNotes}>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Введите заметки к анализу..." 
              className="min-h-[150px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getQualitiesForCode(code: number | string): string {
  const codeNum = Number(code);
  switch (codeNum) {
    case 1: return "лидерство, инициативность, самостоятельность";
    case 2: return "дипломатичность, чуткость, партнерство";
    case 3: return "креативность, самовыражение, творчество";
    case 4: return "надежность, системность, практичность";
    case 5: return "адаптивность, свобода, разнообразие";
    case 6: return "гармония, забота, ответственность";
    case 7: return "аналитичность, глубина, исследование";
    case 8: return "власть, амбиции, организаторские способности";
    case 9: return "мудрость, идеализм, универсальность";
    case 11: return "интуиция, вдохновение, духовность";
    default: return "уникальные особенности личности";
  }
}
