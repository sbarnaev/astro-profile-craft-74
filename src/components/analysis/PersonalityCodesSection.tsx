
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getArchetypeName } from "@/lib/calculations";

interface PersonalityCodesSectionProps {
  codes: {
    personalityCode: number | string;
    connectorCode: number | string;
    realizationCode: number | string;
    generatorCode: number | string;
    missionCode: number | string;
  };
}

export function PersonalityCodesSection({ codes }: PersonalityCodesSectionProps) {
  return (
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
  );
}
