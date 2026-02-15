import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthenticatedLayout, { useSidebarControl } from "@/components/AuthenticatedLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import OTPVerifyScreen from "./pages/OTPVerifyScreen";
import BasicInfoScreen from "./pages/onboarding/BasicInfoScreen";
import ServiceAreaScreen from "./pages/onboarding/ServiceAreaScreen";
import DocumentsScreen from "./pages/onboarding/DocumentsScreen";
import ProfileSetupScreen from "./pages/onboarding/ProfileSetupScreen";
import ServiceSetupScreen from "./pages/onboarding/ServiceSetupScreen";
import MPINSetupScreen from "./pages/onboarding/MPINSetupScreen";
import MPINVerifyScreen from "./pages/MPINVerifyScreen";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import RequestsPage from "./pages/RequestsPage";
import ActivityPage from "./pages/ActivityPage";
import MorePage from "./pages/MorePage";
import ProfilePage from "./pages/ProfilePage";
import JobsPage from "./pages/JobsPage";
import ClientsPage from "./pages/ClientsPage";
import EventsPage from "./pages/EventsPage";
import EventDashboard from "./pages/EventDashboard";
import PaymentsPage from "./pages/PaymentsPage";
import ServiceCatalogPage from "./pages/ServiceCatalogPage";
import InventoryPage from "./pages/InventoryPage";
import CommunicationPage from "./pages/CommunicationPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper components to provide onMenuClick
const HomePageWithMenu = () => {
  const { openSidebar } = useSidebarControl();
  return <HomePage onMenuClick={openSidebar} />;
};

const CalendarPageWithMenu = () => {
  const { openSidebar } = useSidebarControl();
  return <CalendarPage onMenuClick={openSidebar} />;
};

const RequestsPageWithMenu = () => {
  const { openSidebar } = useSidebarControl();
  return <RequestsPage onMenuClick={openSidebar} />;
};

const ActivityPageWithMenu = () => {
  const { openSidebar } = useSidebarControl();
  return <ActivityPage onMenuClick={openSidebar} />;
};

const MorePageWithMenu = () => {
  const { openSidebar } = useSidebarControl();
  return <MorePage onMenuClick={openSidebar} />;
};

const EventsPageWithMenu = () => {
  const { openSidebar } = useSidebarControl();
  return <EventsPage onMenuClick={openSidebar} />;
};

const AppLayout = () => {
  return (
    <AuthenticatedLayout>
      <div className="mx-auto max-w-lg">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/otp-verify" element={<OTPVerifyScreen />} />
          <Route path="/mpin-verify" element={<MPINVerifyScreen />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/basic-info" element={<BasicInfoScreen />} />
          <Route path="/onboarding/service-area" element={<ServiceAreaScreen />} />
          <Route path="/onboarding/documents" element={<DocumentsScreen />} />
          <Route path="/onboarding/profile" element={<ProfileSetupScreen />} />
          <Route path="/onboarding/services" element={<ServiceSetupScreen />} />
          <Route path="/onboarding/mpin" element={<MPINSetupScreen />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePageWithMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPageWithMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestsPageWithMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <ActivityPageWithMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more"
            element={
              <ProtectedRoute>
                <MorePageWithMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/clients"
            element={
              <ProtectedRoute>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/events"
            element={
              <ProtectedRoute>
                <EventsPageWithMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event/:eventId"
            element={
              <ProtectedRoute>
                <EventDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/finance"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/services"
            element={
              <ProtectedRoute>
                <ServiceCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/inventory"
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/communication"
            element={
              <ProtectedRoute>
                <CommunicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/more/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthenticatedLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
