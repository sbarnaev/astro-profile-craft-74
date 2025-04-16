
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisCard } from "./AnalysisCard";
import { AnalysisType } from "@/types/sessions";

interface AnalysisViewProps {
  analysis: AnalysisType;
  onBack: () => void;
}

export function AnalysisView({ analysis, onBack }: AnalysisViewProps) {
  // Преобразуем данные анализа в формат, понятный для AnalysisCard
  const client = {
    id: analysis.clientId,
    name: analysis.clientName,
    phone: analysis.clientPhone,
    dob: analysis.clientDob,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h2 className="text-2xl font-bold">Анализ клиента</h2>
      </div>
      <AnalysisCard client={client} analysis={analysis} onBack={onBack} />
    </div>
  );
}
