
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisCard } from "./AnalysisCard";
import { AnalysisType } from "@/types/consultations";

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

  return <AnalysisCard client={client} analysis={analysis} onBack={onBack} />;
}
