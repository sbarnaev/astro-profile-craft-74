
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SessionsHeaderProps {
  onNewSession: () => void;
}

export function SessionsHeader({ onNewSession }: SessionsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Сессии</h1>
      <Button onClick={onNewSession}>
        <Plus className="mr-2 h-4 w-4" />
        Записать на сессию
      </Button>
    </div>
  );
}
