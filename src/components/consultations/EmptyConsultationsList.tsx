
import { Calendar, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyConsultationsListProps {
  type: "upcoming" | "past";
  onNewConsultation: () => void;
}

export function EmptyConsultationsList({ type, onNewConsultation }: EmptyConsultationsListProps) {
  const isUpcoming = type === "upcoming";
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {isUpcoming ? (
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
      ) : (
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      <h3 className="text-lg font-medium mb-2">
        {isUpcoming ? "Нет предстоящих консультаций" : "Нет прошедших консультаций"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {isUpcoming 
          ? "У вас пока нет запланированных консультаций" 
          : "У вас пока нет проведенных консультаций"
        }
      </p>
      {isUpcoming && (
        <Button onClick={onNewConsultation}>
          <Plus className="mr-2 h-4 w-4" />
          Записать на консультацию
        </Button>
      )}
    </div>
  );
}
