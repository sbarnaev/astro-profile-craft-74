
import { FC } from "react";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  
  // Get first letter of email for avatar
  const userInitial = user?.email ? user.email[0].toUpperCase() : 'П';
  const userEmail = user?.email || 'Пользователь';
  
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-muted-foreground hover:bg-accent/10 transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="ml-4 relative max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск..."
            className="pl-8 bg-muted/50 border-none w-full md:w-60 lg:w-80"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <button className="p-2 rounded-full text-muted-foreground hover:bg-accent/10 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-2 focus:outline-none">
            <div className="flex items-center">
              <div className="mr-2 hidden md:block text-sm text-muted-foreground">
                {userEmail}
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{userInitial}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
