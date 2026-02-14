import { useAppData } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const EventsPage = () => {
  const { events, toggleEventTask, updateEventStatus } = useAppData();

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-10 glass border-b border-border/50 px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Events & Projects</h1>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="font-medium">No events yet</p>
            <p className="text-sm mt-1">Convert a complex job into an event</p>
          </div>
        ) : (
          events.map(event => {
            const completedTasks = event.tasks.filter(t => t.completed).length;
            const progress = event.tasks.length > 0 ? (completedTasks / event.tasks.length) * 100 : 0;
            const profit = event.totalPaid - event.expenses;

            return (
              <div key={event.id} className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card">
                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg tracking-tight">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{event.clientName}</p>
                    </div>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-medium">{completedTasks}/{event.tasks.length} tasks</span>
                    <span className="font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Tasks */}
                <div className="px-4 pb-3 space-y-2">
                  {event.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleEventTask(event.id, task.id)}
                        className="h-5 w-5 rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                        <p className="text-[11px] text-muted-foreground">Due: {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Helpers */}
                {event.helpers.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-xs font-semibold flex items-center gap-1.5 mb-2 uppercase tracking-wider text-muted-foreground"><Users className="h-3.5 w-3.5" /> Team</p>
                    <div className="flex flex-wrap gap-2">
                      {event.helpers.map((h, i) => (
                        <span key={i} className="text-xs rounded-lg bg-accent text-accent-foreground px-3 py-1 font-medium">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance */}
                <div className="border-t border-border/40 p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-muted/50 p-2.5">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Budget</p>
                      <p className="font-bold mt-0.5">₹{(event.budget / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="rounded-xl bg-success/5 p-2.5">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Received</p>
                      <p className="font-bold text-success mt-0.5">₹{(event.totalPaid / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="rounded-xl bg-accent/50 p-2.5">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Profit</p>
                      <p className={`font-bold mt-0.5 ${profit >= 0 ? "text-success" : "text-destructive"}`}>₹{(profit / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {event.status !== "completed" && (
                  <div className="border-t border-border/40 p-3">
                    <Button
                      className="w-full rounded-xl h-11 font-semibold gradient-primary border-0 shadow-card"
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
