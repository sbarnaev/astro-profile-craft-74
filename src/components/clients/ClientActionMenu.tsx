
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, FileText, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ClientActionMenuProps {
  clientId: string;
}

export function ClientActionMenu({ clientId }: ClientActionMenuProps) {
  const navigate = useNavigate();

  const handleSessionSchedule = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      navigate(`/sessions/schedule?client=${clientId}`);
    } catch (error) {
      console.error("Ошибка при открытии диалога сессии:", error);
      toast.error("Не удалось открыть форму записи на сессию");
    }
  };

  const handleOpenAnalysis = (e: React.MouseEvent) => {
    e.preventDefault();
    // Перенаправление на страницу клиента, где будет показан анализ
    navigate(`/clients/${clientId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/clients/${clientId}`}>Профиль</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenAnalysis}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Анализ</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSessionSchedule}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Записать на сессию</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/clients/${clientId}`} state={{ openReminder: true }}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Создать напоминание</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
