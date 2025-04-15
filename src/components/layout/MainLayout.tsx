
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      // По умолчанию сайдбар скрыт на десктопе
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  useEffect(() => {
    // Закрываем сайдбар при смене роута
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div 
        className="h-full"
        onMouseEnter={handleMouseEnter}
      >
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
        />
      </div>
      
      <div 
        className={`flex flex-col flex-1 w-full overflow-hidden transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        }`}
        onMouseEnter={handleMouseLeave}
      >
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
