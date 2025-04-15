
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisCard } from "./AnalysisCard";

interface AnalysisViewProps {
  analysis: any;
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

  return <AnalysisCard client={client} onBack={onBack} />;
}
