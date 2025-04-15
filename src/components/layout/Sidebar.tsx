
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Home, 
  Settings, 
  ClipboardList, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Главная", path: "/", icon: Home },
    { name: "Клиенты", path: "/clients", icon: Users },
    { name: "Анализы", path: "/analysis", icon: ClipboardList },
    { name: "Календарь", path: "/calendar", icon: Calendar },
    { name: "Настройки", path: "/settings", icon: Settings },
  ];

  // Проверяем, активна ли ссылка
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside 
      className={`h-screen bg-sidebar fixed lg:relative z-30 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 lg:w-20"
      } shadow-md overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Заголовок */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {isOpen && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                А
              </div>
              <span className="ml-2 font-medium text-sidebar-foreground">AstroProfile</span>
            </div>
          )}
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors lg:block hidden"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
        
        {/* Навигация */}
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                    isActive(item.path) 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon size={20} />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Профиль мастера */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
              М
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">Мастер</p>
                <p className="text-xs text-sidebar-foreground/70">Профиль</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
