
import { FC } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: FC<TopBarProps> = ({ onMenuClick }) => {
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
        
        <div className="ml-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">М</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
