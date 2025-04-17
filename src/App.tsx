import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Analysis from "./pages/Analysis";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Переименованные страницы (консультации -> сессии)
import Sessions from "./pages/Sessions";
import Analytics from "./pages/Analytics";
import Knowledge from "./pages/Knowledge";
import Reminders from "./pages/Reminders";

// Новые страницы для онлайн-записи
import ScheduleSettings from "./pages/ScheduleSettings";
import PublicBooking from "./pages/PublicBooking";

const queryClient = new QueryClient();

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Wrapper component to provide auth context
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/booking/:consultantId" element={<PublicBooking />} />
        
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analysis/:id" element={<Analysis />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/schedule" element={<Sessions />} />
          <Route path="/consultations" element={<Navigate to="/sessions" />} />
          <Route path="/consultations/:id" element={<Navigate to="/sessions" />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/schedule" element={<ScheduleSettings />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithAuth />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
