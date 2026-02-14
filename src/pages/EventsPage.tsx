import { useAppData } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Calendar, Users } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-12 pb-3">
        <h1 className="text-lg font-bold mb-3">Events</h1>
        {/* Tabs */}
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["active", "completed"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-md py-1.5 text-xs font-semibold transition-all capitalize",
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
            <Calendar className="h-6 w-6 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No {tab} events</p>
          </div>
        ) : (
          displayed.map(event => {
            const completedTasks = event.tasks.filter(t => t.completed).length;
            const progress = event.tasks.length > 0 ? (completedTasks / event.tasks.length) * 100 : 0;
            const profit = event.totalPaid - event.expenses;

            return (
              <div key={event.id} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.clientName}</p>
                    </div>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="px-3 pb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground">{completedTasks}/{event.tasks.length} tasks</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Tasks */}
                <div className="px-3 pb-2 space-y-0.5">
                  {event.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-2.5 py-1.5 px-1 rounded-lg active:bg-muted/40 transition-colors">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleEventTask(event.id, task.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</p>
                        <p className="text-[10px] text-muted-foreground">Due: {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Team */}
                {event.helpers.length > 0 && (
                  <div className="px-3 pb-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Team
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {event.helpers.map((h, i) => (
                        <span key={i} className="text-[11px] rounded-md bg-muted text-muted-foreground px-2 py-0.5 font-medium">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance */}
                <div className="border-t border-border p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-medium">Budget</p>
                      <p className="text-sm font-bold">₹{(event.budget / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-medium">Received</p>
                      <p className="text-sm font-bold text-success">₹{(event.totalPaid / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground font-medium">Profit</p>
                      <p className={cn("text-sm font-bold", profit >= 0 ? "text-success" : "text-destructive")}>₹{(profit / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                {event.status !== "completed" && (
                  <div className="border-t border-border p-3">
                    <Button
                      className="w-full rounded-lg h-10 text-sm font-semibold"
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
