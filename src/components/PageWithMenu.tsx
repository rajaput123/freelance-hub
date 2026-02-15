import { ReactNode } from "react";
import { useSidebarControl } from "./AuthenticatedLayout";

interface PageWithMenuProps {
  children: (onMenuClick: () => void) => ReactNode;
}

export const PageWithMenu = ({ children }: PageWithMenuProps) => {
  const { openSidebar } = useSidebarControl();
  return <>{children(openSidebar)}</>;
};
