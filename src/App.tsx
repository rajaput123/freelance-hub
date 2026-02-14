import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import AppSidebar from "@/components/AppSidebar";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import RequestsPage from "./pages/RequestsPage";
import ActivityPage from "./pages/ActivityPage";
import MorePage from "./pages/MorePage";
import ProfilePage from "./pages/ProfilePage";
import JobsPage from "./pages/JobsPage";
import ClientsPage from "./pages/ClientsPage";
import EventsPage from "./pages/EventsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ServiceCatalogPage from "./pages/ServiceCatalogPage";
import InventoryPage from "./pages/InventoryPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <>
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="mx-auto max-w-lg">
      <Routes>
        <Route path="/" element={<HomePage onMenuClick={openSidebar} />} />
        <Route path="/calendar" element={<CalendarPage onMenuClick={openSidebar} />} />
        <Route path="/requests" element={<RequestsPage onMenuClick={openSidebar} />} />
        <Route path="/activity" element={<ActivityPage onMenuClick={openSidebar} />} />
        <Route path="/more" element={<MorePage onMenuClick={openSidebar} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/more/jobs" element={<JobsPage />} />
        <Route path="/more/clients" element={<ClientsPage />} />
        <Route path="/more/events" element={<EventsPage />} />
        <Route path="/more/finance" element={<PaymentsPage />} />
        <Route path="/more/services" element={<ServiceCatalogPage />} />
        <Route path="/more/inventory" element={<InventoryPage />} />
        <Route path="/more/announcements" element={<AnnouncementsPage />} />
        <Route path="/more/reports" element={<ReportsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
