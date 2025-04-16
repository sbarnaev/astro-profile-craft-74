
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  initialNotes: string;
  onSave?: (notes: string) => void;
}

export function NotesSection({ initialNotes, onSave }: NotesSectionProps) {
  const [notes, setNotes] = useState(initialNotes || "");

  const handleSaveNotes = () => {
    if (onSave) {
      onSave(notes);
    } else {
      console.log("Сохранение заметок:", notes);
      // Здесь будет логика сохранения заметок
    }
  };

  return (
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
  );
}
