import { useAppData } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Calendar, Users, CheckCircle, Circle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const EventsPage = () => {
  const { events, toggleEventTask, updateEventStatus } = useAppData();

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold">Events & Projects</h1>
      </div>

      <div className="px-5 mt-4 space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No events yet</p>
            <p className="text-sm mt-1">Convert a complex job into an event to manage it here</p>
          </div>
        ) : (
          events.map(event => {
            const completedTasks = event.tasks.filter(t => t.completed).length;
            const progress = event.tasks.length > 0 ? (completedTasks / event.tasks.length) * 100 : 0;
            const profit = event.totalPaid - event.expenses;

            return (
              <div key={event.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.clientName}</p>
                    </div>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{completedTasks}/{event.tasks.length} tasks</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Tasks */}
                <div className="px-4 pb-3 space-y-2">
                  {event.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleEventTask(event.id, task.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                        <p className="text-xs text-muted-foreground">Due: {task.deadline}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Helpers */}
                {event.helpers.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-sm font-medium flex items-center gap-1 mb-1"><Users className="h-4 w-4" /> Team</p>
                    <div className="flex flex-wrap gap-2">
                      {event.helpers.map((h, i) => (
                        <span key={i} className="text-xs rounded-full bg-secondary px-3 py-1">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Finance */}
                <div className="border-t border-border p-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-bold">₹{(event.budget / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Received</p>
                      <p className="font-bold text-success">₹{(event.totalPaid / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit</p>
                      <p className={`font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>₹{(profit / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {event.status !== "completed" && (
                  <div className="border-t border-border p-3">
                    <Button
                      variant={event.status === "planning" ? "default" : "outline"}
                      className="w-full rounded-xl h-10"
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
