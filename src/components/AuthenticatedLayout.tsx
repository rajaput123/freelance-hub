import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import AppSidebar from "@/components/AppSidebar";
import { useState, ReactNode, createContext, useContext, useCallback } from "react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

interface SidebarContextType {
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebarControl = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    // Return a no-op function if context is not available
    return { openSidebar: () => {}, closeSidebar: () => {} };
  }
  return context;
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <SidebarContext.Provider value={{ openSidebar, closeSidebar }}>
      <AppSidebar open={sidebarOpen} onClose={closeSidebar} />
      {children}
      <BottomNav />
    </SidebarContext.Provider>
  );
};

export default AuthenticatedLayout;
