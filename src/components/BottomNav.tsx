import { Home, Briefcase, Users, Calendar, User, Plus } from "lucide-react";
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
      {/* FAB menu overlay */}
      {showFab && (
        <div className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm" onClick={() => setShowFab(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <AddJobSheet
              trigger={
                <button className="flex items-center gap-3 bg-card rounded-2xl px-5 py-3 shadow-lg active:scale-95 transition-transform" onClick={() => setShowFab(false)}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">New Job</span>
                </button>
              }
            />
            <AddClientSheet
              trigger={
                <button className="flex items-center gap-3 bg-card rounded-2xl px-5 py-3 shadow-lg active:scale-95 transition-transform" onClick={() => setShowFab(false)}>
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <span className="font-semibold text-sm">Add Client</span>
                </button>
              }
            />
            <button 
              className="flex items-center gap-3 bg-card rounded-2xl px-5 py-3 shadow-lg active:scale-95 transition-transform"
              onClick={() => { setShowFab(false); navigate("/events"); }}
            >
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-info" />
              </div>
              <span className="font-semibold text-sm">New Event</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
        <div className="mx-auto flex max-w-lg items-center justify-around h-16">
          {tabs.map(({ path, icon: Icon, label }) => {
            if (path === "fab") {
              return (
                <button
                  key="fab"
                  onClick={() => setShowFab(v => !v)}
                  className={cn(
                    "relative -mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all active:scale-90",
                    showFab && "rotate-45 bg-foreground"
                  )}
                >
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                </button>
              );
            }

            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-semibold leading-none">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
