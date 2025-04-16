
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisType } from "@/types/sessions";
import { useIsMobile } from "@/hooks/use-mobile";
import { calculatePersonalityCodes } from "@/lib/calculations";
import { ClientInfoSection } from "./ClientInfoSection";
import { PersonalityCodesSection } from "./PersonalityCodesSection";
import { SummarySection } from "./SummarySection";
import { DetailSections } from "./DetailSections";
import { NotesSection } from "./NotesSection";
import { toast } from "sonner";

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

  const handleSaveNotes = (newNotes: string) => {
    setNotes(newNotes);
    // Здесь будет код для сохранения заметок в базу данных
    console.log("Сохранение заметок:", newNotes);
    toast.success("Заметки сохранены");
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
        <ClientInfoSection client={client} />
        <PersonalityCodesSection codes={codes} />
        <SummarySection codes={codes} />
        <DetailSections 
          openSection={openSection} 
          toggleSection={toggleSection} 
          codes={codes} 
        />
        <NotesSection 
          initialNotes={notes} 
          onSave={handleSaveNotes}
        />
      </div>
    </div>
  );
}
