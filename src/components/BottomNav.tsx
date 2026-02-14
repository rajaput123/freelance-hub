import { Home, Briefcase, Users, Calendar, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/jobs", icon: Briefcase, label: "Jobs" },
  { path: "/clients", icon: Users, label: "Clients" },
  { path: "/events", icon: Calendar, label: "Events" },
  { path: "/payments", icon: Wallet, label: "Earnings" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="mx-auto max-w-lg px-3 pb-2">
        <div className="glass rounded-2xl border border-border/50 shadow-elevated">
          <div className="flex items-center justify-around py-1.5">
            {tabs.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-medium transition-all duration-200 rounded-xl min-w-[52px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground active:text-foreground"
                  )}
                >
                  <div className={cn(
                    "relative p-1 rounded-xl transition-all duration-200",
                    isActive && "bg-accent"
                  )}>
                    <Icon className={cn("h-5 w-5 transition-all", isActive && "stroke-[2.5px]")} />
                  </div>
                  <span className="leading-tight">{label}</span>
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
