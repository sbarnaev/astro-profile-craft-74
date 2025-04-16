
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getArchetypeName } from "@/lib/calculations";

interface SummarySectionProps {
  codes: {
    personalityCode: number | string;
    connectorCode: number | string;
    realizationCode: number | string;
  };
}

export function SummarySection({ codes }: SummarySectionProps) {
  return (
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
  );
}
