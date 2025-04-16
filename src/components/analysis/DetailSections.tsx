
import { FileText, AlertCircle, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getArchetypeName } from "@/lib/calculations";

interface DetailSectionsProps {
  openSection: string | null;
  toggleSection: (section: string) => void;
  codes: {
    personalityCode: number | string;
    connectorCode: number | string;
    realizationCode: number | string;
    generatorCode: number | string;
    missionCode: number | string;
  };
}

export function DetailSections({ openSection, toggleSection, codes }: DetailSectionsProps) {
  return (
    <>
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
        {openSection === "decoding" && <DecodingSection codes={codes} />}
        {openSection === "conflicts" && <ConflictsSection codes={codes} />}
        {openSection === "archetypes" && <ArchetypesSection codes={codes} />}
        {openSection === "summary" && <DetailedSummarySection codes={codes} />}
      </div>
    </>
  );
}

interface CodeSectionProps {
  codes: {
    personalityCode: number | string;
    connectorCode: number | string;
    realizationCode: number | string;
    generatorCode: number | string;
    missionCode: number | string;
  };
}

function DecodingSection({ codes }: CodeSectionProps) {
  return (
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
  );
}

function ConflictsSection({ codes }: CodeSectionProps) {
  return (
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
  );
}

function ArchetypesSection({ codes }: CodeSectionProps) {
  return (
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
  );
}

function DetailedSummarySection({ codes }: CodeSectionProps) {
  return (
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
