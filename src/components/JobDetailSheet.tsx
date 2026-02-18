import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Play, CheckCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface JobDetailSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailSheet = ({ job, open, onOpenChange }: JobDetailSheetProps) => {
  // ALL hooks must ALWAYS be called in the same order on every render
  // This is critical - hooks must be called unconditionally, before any returns
  const { updateJobStatus } = useAppData();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message when sheet opens for a newly scheduled job
  useEffect(() => {
    // Only set success message if job exists and is scheduled
    if (open && job && job.status === "scheduled") {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowSuccessMessage(false);
    }
  }, [open, job?.status, job]);

  // NEVER return null - always render Sheet component
  // Control visibility via open prop instead of conditional rendering
  return (
    <Sheet open={open && !!job} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        {job ? (
          <>
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
            <SheetHeader>
              <SheetTitle className="text-left flex items-center gap-2.5 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {job.service || job.taskName || "Job"}
                <StatusBadge status={job.status} />
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4">
          {/* Success Celebration Banner - Enhanced */}
          {showSuccessMessage && job.status === "scheduled" && (
            <div className="bg-gradient-to-r from-success/15 via-success/10 to-success/15 border-2 border-success/30 rounded-3xl p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="h-12 w-12 rounded-2xl bg-success/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-success mb-1.5">🎉 Request Accepted!</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your booking is now scheduled. You can start the job when you're ready to begin work.
                </p>
              </div>
            </div>
          )}

          {/* Job Info Card - Redesigned */}
          <div className="bg-gradient-to-br from-muted/80 to-muted/50 rounded-3xl p-5 border border-border/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                {(job.clientName || job.freelancerName || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-foreground">{job.clientName || job.freelancerName || "Unknown"}</p>
                <p className="text-sm text-muted-foreground font-medium">{job.service || job.taskName || "Service"}</p>
              </div>
            </div>

            {/* Details in Grid */}
            <div className="space-y-2.5">
              {job.date && (
                <div className="flex items-center gap-3 bg-background/80 rounded-xl p-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Date & Time</p>
                    <p className="text-sm font-semibold text-foreground">{job.date}{job.time ? ` · ${job.time}` : ""}</p>
                  </div>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-3 bg-background/80 rounded-xl p-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-semibold text-foreground">{job.location}</p>
                  </div>
                </div>
              )}
              {(job.notes || job.taskDescription) && (
                <div className="bg-background/80 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1.5">Notes</p>
                  <p className="text-sm text-foreground italic">"{job.notes || job.taskDescription}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Card - Enhanced */}
          <div className="gradient-primary rounded-3xl p-5 text-primary-foreground shadow-glow">
            <p className="text-xs uppercase tracking-wider opacity-90 font-semibold mb-2">Total Amount</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ₹{(job.amount || 0).toLocaleString()}
            </p>
          </div>

          {/* Primary Actions - Simple flow */}
          <div className="space-y-2.5">
            {job.status === "scheduled" && (
              <>
                <Button
                  onClick={() => { 
                    updateJobStatus(job.id, "in_progress"); 
                    toast.success("Job started! You can now track progress and add expenses."); 
                    onOpenChange(false);
                  }}
                  className="w-full h-14 rounded-2xl gap-3 text-base font-bold gradient-primary shadow-glow border-0 hover:opacity-90 transition-opacity"
                >
                  <Play className="h-5 w-5" /> Start Job
                </Button>
                <div className="bg-info/10 border border-info/20 rounded-2xl p-3">
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    💡 <span className="font-semibold">Next Step:</span> Click "Start Job" when you begin work. You'll be able to track progress, add expenses, and manage materials.
                  </p>
                </div>
              </>
            )}

            {job.status === "in_progress" && (
              <Button
                onClick={() => { 
                  updateJobStatus(job.id, "completed"); 
                  toast.success("Job completed!"); 
                  onOpenChange(false);
                }}
                className="w-full h-12 rounded-2xl gap-2 text-sm font-bold bg-success hover:bg-success/90 border-0"
              >
                <CheckCircle className="h-4 w-4" /> Mark Complete
              </Button>
            )}
          </div>
        </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No job selected</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default JobDetailSheet;
