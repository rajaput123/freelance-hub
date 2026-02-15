import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Calendar, Users, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AddEventSheet from "@/components/AddEventSheet";

const EventsPage = () => {
  const { events, toggleEventTask, updateEventStatus } = useAppData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [showAddEvent, setShowAddEvent] = useState(false);

  const activeEvents = events.filter(e => e.status !== "completed");
  const completedEvents = events.filter(e => e.status === "completed");
  const displayed = tab === "active" ? activeEvents : completedEvents;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold flex-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Events / Projects</h1>
          <AddEventSheet
            trigger={
              <button className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center active:scale-95 transition-transform shadow-glow">
                <Plus className="h-4 w-4 text-primary-foreground" />
              </button>
            }
            />
        </div>
        <div className="flex bg-card rounded-2xl p-1 shadow-soft">
          {(["active", "completed"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold transition-all capitalize",
                tab === t ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              )}
            >
              {t} ({t === "active" ? activeEvents.length : completedEvents.length})
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {displayed.length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold">No {tab} events</p>
          </div>
        ) : (
          displayed.map(event => {
            const completedTasks = event.tasks.filter(t => t.completed).length;
            const progress = event.tasks.length > 0 ? (completedTasks / event.tasks.length) * 100 : 0;
            const profit = event.totalPaid - event.expenses;

            return (
              <div
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="bg-card rounded-2xl overflow-hidden shadow-soft cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{event.clientName}</p>
                    </div>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-2.5">
                    <span className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1"><Calendar className="h-3 w-3" /> {event.date}</span>
                    <span className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-muted-foreground font-medium">{completedTasks}/{event.tasks.length} tasks</span>
                    <span className="font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="px-4 pb-2 space-y-0.5">
                  {event.tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 py-2 px-1.5 rounded-xl active:bg-muted/40 transition-colors"
                    >
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleEventTask(event.id, task.id)} className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">Due: {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {event.helpers.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1"><Users className="h-3 w-3" /> Team</p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.helpers.map((h, i) => (
                        <span key={i} className="text-[11px] rounded-lg bg-muted text-muted-foreground px-2.5 py-1 font-semibold">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Budget", value: `₹${(event.budget / 1000).toFixed(0)}k`, color: "" },
                      { label: "Received", value: `₹${(event.totalPaid / 1000).toFixed(0)}k`, color: "text-success" },
                      { label: "Profit", value: `₹${(profit / 1000).toFixed(0)}k`, color: profit >= 0 ? "text-success" : "text-destructive" },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-[10px] text-muted-foreground font-semibold">{s.label}</p>
                        <p className={cn("text-sm font-bold", s.color)} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsPage;
