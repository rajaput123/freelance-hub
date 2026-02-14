import { Home, Calendar, ClipboardList, Activity, MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/requests", icon: ClipboardList, label: "Requests" },
  { path: "/activity", icon: Activity, label: "Activity" },
  { path: "/more", icon: MoreHorizontal, label: "More" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="mx-auto max-w-lg flex items-center justify-around h-14 px-1">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[44px] transition-colors flex-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
