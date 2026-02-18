import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Job } from "@/data/types";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { toast } from "sonner";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RescheduleSheetProps {
  request: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RescheduleSheet = ({ request, open, onOpenChange }: RescheduleSheetProps) => {
  // ALL hooks must ALWAYS be called in the same order on every render
  // This is critical - hooks must be called unconditionally, before any returns
  const { updateJobStatus, updateJobSchedule, jobs } = useAppData();
  const [newDate, setNewDate] = useState(request?.date || "");
  const [newTime, setNewTime] = useState(request?.time || "");

  // Update date/time when request changes
  useEffect(() => {
    if (request && open) {
      setNewDate(request.date);
      setNewTime(request.time);
    }
  }, [request, open]);

  // Check for conflicts - must handle null request case
  const hasConflict = useMemo(() => {
    if (!request || !newDate || !newTime) return false;
    const dayJobs = jobs.filter(j => j.date === newDate && j.status !== "pending" && j.status !== "cancelled" && j.id !== request.id);
    const [hour, minute] = newTime.split(":").map(Number);
    const checkTime = hour * 60 + minute;

    return dayJobs.some(job => {
      if (!job.time) return false; // Skip jobs without time
      const [jobHour, jobMinute] = job.time.split(":").map(Number);
      const jobTime = jobHour * 60 + jobMinute;
      return Math.abs(checkTime - jobTime) < 60;
    });
  }, [newDate, newTime, jobs, request?.id]);

  const conflictingJobs = useMemo(() => {
    if (!request || !hasConflict || !newDate || !newTime) return [];
    const dayJobs = jobs.filter(j => j.date === newDate && j.status !== "pending" && j.status !== "cancelled" && j.id !== request.id);
    const [hour, minute] = newTime.split(":").map(Number);
    const checkTime = hour * 60 + minute;

    return dayJobs.filter(job => {
      if (!job.time) return false; // Skip jobs without time
      const [jobHour, jobMinute] = job.time.split(":").map(Number);
      const jobTime = jobHour * 60 + jobMinute;
      return Math.abs(checkTime - jobTime) < 60;
    });
  }, [hasConflict, newDate, newTime, jobs, request?.id]);

  const handleReschedule = () => {
    if (!request) return;
    if (!newDate || !newTime) {
      toast.error("Please select both date and time");
      return;
    }

    if (hasConflict) {
      toast.error("Time slot conflicts with existing booking!");
      return;
    }

    // Update job with new date and time and accept it
    updateJobSchedule(request.id, newDate, newTime);
    updateJobStatus(request.id, "scheduled");
    toast.success("Request rescheduled and accepted!");
    onOpenChange(false);
  };

  // NEVER return null - always render Sheet component
  // Control visibility via open prop instead of conditional rendering
  return (
    <Sheet open={open && !!request} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-0 bg-background">
        {request ? (
          <>
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
            <SheetHeader>
              <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Reschedule Request
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4">
              {/* Current Schedule */}
              <div className="bg-muted/50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Current Schedule</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{request.date}{request.time ? ` at ${request.time}` : ""}</span>
                </div>
              </div>

          {/* New Schedule */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                New Date
              </label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="h-12 rounded-xl"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                New Time
              </label>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Conflict Warning */}
          {hasConflict && conflictingJobs.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-destructive mb-1">Schedule Conflict</p>
                  <p className="text-[10px] text-muted-foreground">
                    This time overlaps with: {conflictingJobs.map(j => `${j.clientName || j.freelancerName || "Unknown"} (${j.time || "No time"})`).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action */}
          <Button
            onClick={handleReschedule}
            disabled={!newDate || !newTime || hasConflict}
            className={cn(
              "w-full h-12 rounded-2xl text-sm font-bold border-0 disabled:opacity-50",
              hasConflict ? "bg-destructive/50 cursor-not-allowed" : "gradient-primary shadow-glow"
            )}
          >
            {hasConflict ? "Resolve Conflict First" : "Confirm Reschedule"}
          </Button>
        </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No request selected</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RescheduleSheet;
