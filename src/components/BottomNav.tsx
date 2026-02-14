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
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-auto max-w-lg px-3 pb-2">
        <div className="glass rounded-2xl shadow-soft">
          <div className="flex items-center justify-around h-16 px-1">
            {tabs.map(({ path, icon: Icon, label }) => {
              const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 min-w-[52px] min-h-[44px] transition-all duration-200 flex-1 rounded-xl",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-200",
                    isActive && "gradient-primary shadow-glow"
                  )}>
                    <Icon className={cn("h-[18px] w-[18px]", isActive && "text-primary-foreground")} strokeWidth={isActive ? 2.2 : 1.6} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium leading-none transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
