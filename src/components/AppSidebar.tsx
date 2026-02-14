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
      {open && (
        <div className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[300px] z-[80] bg-card shadow-2xl transition-transform duration-300 ease-out rounded-r-3xl",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="gradient-primary px-5 pt-5 pb-6 rounded-br-[32px]">
          <button onClick={onClose} className="absolute top-5 right-5 h-8 w-8 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
            <X className="h-4 w-4 text-primary-foreground" />
          </button>
          <div className="flex items-center gap-3.5 mt-1">
            <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Freelancer Pro</h2>
              <p className="text-[11px] text-primary-foreground/70 mt-0.5">freelancer@example.com</p>
            </div>
          </div>
        </div>

        <div className="px-3 mt-5 space-y-1">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleNav(item.path)}
              className="flex items-center gap-3.5 w-full px-3.5 py-3.5 rounded-2xl text-left hover:bg-muted/60 active:bg-muted transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <item.icon className="h-[18px] w-[18px] text-muted-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-8 safe-bottom">
          <button className="flex items-center gap-3.5 w-full px-3.5 py-3.5 rounded-2xl text-left hover:bg-destructive/5 active:bg-destructive/10 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="h-[18px] w-[18px] text-destructive" />
            </div>
            <span className="font-semibold text-sm text-destructive">Log Out</span>
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-4">Version 1.0.0</p>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
