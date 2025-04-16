
import { ConsultationList } from "@/components/consultations/ConsultationList";
import { EmptyConsultationsList } from "@/components/consultations/EmptyConsultationsList";

interface SessionsTabContentProps {
  consultations: any[];
  type: "upcoming" | "past";
  onNewConsultation: () => void;
  onConsultationClick: (consultation: any) => void;
}

export function SessionsTabContent({
  consultations,
  type,
  onNewConsultation,
  onConsultationClick,
}: SessionsTabContentProps) {
  return (
    <ConsultationList 
      consultations={consultations}
      emptyMessage={
        <EmptyConsultationsList 
          type={type} 
          onNewConsultation={onNewConsultation}
        />
      }
      onConsultationClick={onConsultationClick}
    />
  );
}
