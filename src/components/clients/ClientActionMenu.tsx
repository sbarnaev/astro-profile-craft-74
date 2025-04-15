
import { Link } from "react-router-dom";
import { MoreHorizontal, FileText, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ClientActionMenuProps {
  clientId: string; // Changed from number to string to match Supabase UUID format
}

export function ClientActionMenu({ clientId }: ClientActionMenuProps) {
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
        <DropdownMenuItem asChild>
          <Link to={`/consultations/schedule?client=${clientId}`}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Записать на консультацию</span>
          </Link>
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
