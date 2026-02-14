import { Home, Briefcase, Calendar, User, Plus, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AddJobSheet from "./AddJobSheet";
import AddClientSheet from "./AddClientSheet";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/jobs", icon: Briefcase, label: "Jobs" },
  { path: "fab", icon: Plus, label: "" },
  { path: "/events", icon: Calendar, label: "Events" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFab, setShowFab] = useState(false);

  return (
    <>
      {/* FAB overlay */}
      {showFab && (
        <div className="fixed inset-0 z-[60] bg-black/30" onClick={() => setShowFab(false)}>
          <div className="absolute bottom-[88px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
            <AddJobSheet
              trigger={
                <button className="flex items-center gap-3 bg-card rounded-2xl pl-4 pr-6 py-3 shadow-lg active:scale-95 transition-transform min-w-[160px]" onClick={() => setShowFab(false)}>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">New Job</span>
                </button>
              }
            />
            <AddClientSheet
              trigger={
                <button className="flex items-center gap-3 bg-card rounded-2xl pl-4 pr-6 py-3 shadow-lg active:scale-95 transition-transform min-w-[160px]" onClick={() => setShowFab(false)}>
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-semibold text-sm">Add Client</span>
                </button>
              }
            />
            <button
              className="flex items-center gap-3 bg-card rounded-2xl pl-4 pr-6 py-3 shadow-lg active:scale-95 transition-transform min-w-[160px]"
              onClick={() => { setShowFab(false); navigate("/events"); }}
            >
              <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-info" />
              </div>
              <span className="font-semibold text-sm">New Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
        <div className="mx-auto max-w-lg flex items-center justify-around h-14 px-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            if (path === "fab") {
              return (
                <button
                  key="fab"
                  onClick={() => setShowFab(v => !v)}
                  className={cn(
                    "relative -mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md active:scale-90 transition-all",
                    showFab && "rotate-45"
                  )}
                >
                  <Plus className="h-6 w-6" strokeWidth={2.5} />
                </button>
              );
            }
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[44px] transition-colors",
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
    </>
  );
};

export default BottomNav;
