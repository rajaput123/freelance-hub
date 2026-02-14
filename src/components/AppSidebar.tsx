import { User, Bell, Settings, HelpCircle, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Help & Support", icon: HelpCircle, path: "/help" },
];

const AppSidebar = ({ open, onClose }: AppSidebarProps) => {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-[70] bg-black/40" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] z-[80] bg-card shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="bg-primary px-4 pt-4 pb-5">
          <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/70">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-primary-foreground">Freelancer Pro</h2>
              <p className="text-[11px] text-primary-foreground/70">freelancer@example.com</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="px-2 mt-3">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNav(item.path)}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left active:bg-muted/60 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-medium text-sm text-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-8 safe-bottom">
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left active:bg-destructive/5 transition-colors">
            <div className="h-9 w-9 rounded-lg bg-destructive/8 flex items-center justify-center">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <span className="font-medium text-sm text-destructive">Log Out</span>
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-3">Version 1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
