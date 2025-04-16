
import { Link, useNavigate } from "react-router-dom";
import { MoreHorizontal, FileText, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ClientActionMenuProps {
  clientId: string;
}

export function ClientActionMenu({ clientId }: ClientActionMenuProps) {
  const navigate = useNavigate();

  const handleSessionSchedule = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/sessions/schedule?client=${clientId}`);
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
        <DropdownMenuItem asChild>
          <Link to={`/analysis/${clientId}`}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Анализ</span>
          </Link>
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
