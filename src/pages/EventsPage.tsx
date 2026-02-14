import { useAppData } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

const EventsPage = () => {
  const { events, toggleEventTask, updateEventStatus } = useAppData();
  const [tab, setTab] = useState<"active" | "completed">("active");

  const activeEvents = events.filter(e => e.status !== "completed");
  const completedEvents = events.filter(e => e.status === "completed");
  const displayed = tab === "active" ? activeEvents : completedEvents;

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-11 pb-3">
        <h1 className="text-xl font-bold mb-3">Events</h1>
        <div className="flex bg-background rounded-xl p-1 border border-border">
          {(["active", "completed"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-lg py-2 text-[13px] font-semibold transition-all capitalize",
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {t} ({t === "active" ? activeEvents.length : completedEvents.length})
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-[14px]">No {tab} events</p>
          </div>
        ) : (
          displayed.map(event => {
            const completedTasks = event.tasks.filter(t => t.completed).length;
            const progress = event.tasks.length > 0 ? (completedTasks / event.tasks.length) * 100 : 0;
            const profit = event.totalPaid - event.expenses;

            return (
              <div key={event.id} className="rounded-2xl bg-card border border-border/50 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-[16px] truncate">{event.title}</h3>
                      <p className="text-[13px] text-muted-foreground mt-0.5">{event.clientName}</p>
                    </div>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground font-medium">{completedTasks}/{event.tasks.length} tasks done</span>
                    <span className="font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Tasks */}
                <div className="px-4 pb-3 space-y-1">
                  {event.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 py-1.5 px-2 rounded-xl hover:bg-muted/30 transition-colors">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleEventTask(event.id, task.id)}
                        className="h-[18px] w-[18px] rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[13px] font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                        <p className="text-[11px] text-muted-foreground">Due: {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Team */}
                {event.helpers.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Team
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.helpers.map((h, i) => (
                        <span key={i} className="text-[11px] rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 font-medium">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance */}
                <div className="border-t border-border/40 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/30 rounded-xl p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Budget</p>
                      <p className="font-bold text-[14px] mt-0.5">₹{(event.budget / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-success/5 rounded-xl p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Received</p>
                      <p className="font-bold text-[14px] text-success mt-0.5">₹{(event.totalPaid / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="bg-accent/50 rounded-xl p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Profit</p>
                      <p className={cn("font-bold text-[14px] mt-0.5", profit >= 0 ? "text-success" : "text-destructive")}>₹{(profit / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                {event.status !== "completed" && (
                  <div className="border-t border-border/40 p-3">
                    <Button
                      className="w-full rounded-xl h-11 font-semibold text-[14px]"
                      onClick={() => {
                        const next = event.status === "planning" ? "in_progress" : "completed";
                        updateEventStatus(event.id, next as typeof event.status);
                        toast.success(next === "in_progress" ? "Event started!" : "Event completed!");
                      }}
                    >
                      {event.status === "planning" ? "Start Event" : "Mark Complete"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsPage;
