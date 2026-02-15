import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Play, CheckCircle, CalendarCheck } from "lucide-react";

interface JobDetailSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailSheet = ({ job, open, onOpenChange }: JobDetailSheetProps) => {
  const { updateJobStatus } = useAppData();

  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-2.5 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {job.service}
            <StatusBadge status={job.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {/* Job info */}
          <div className="bg-muted/50 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow/50">
                {job.clientName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{job.clientName}</p>
                <p className="text-xs text-muted-foreground font-medium">{job.service}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground ml-[52px]">
              <span className="flex items-center gap-1 bg-card rounded-lg px-2 py-1"><Clock className="h-3 w-3" /> {job.date} · {job.time}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-[52px]">
              <span className="flex items-center gap-1 bg-card rounded-lg px-2 py-1"><MapPin className="h-3 w-3" /> {job.location}</span>
            </div>
            {job.notes && <p className="text-xs text-muted-foreground ml-[52px] italic">"{job.notes}"</p>}
          </div>

          {/* Amount - Simple display only */}
          <div className="gradient-primary rounded-2xl p-4 text-primary-foreground shadow-glow">
            <p className="text-[10px] uppercase tracking-wider opacity-75 font-semibold mb-1">Amount</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{job.amount.toLocaleString()}</p>
          </div>

          {/* Primary Actions - Simple flow */}
          <div className="space-y-2.5">
            {job.status === "pending" && (
              <Button
                onClick={() => { 
                  updateJobStatus(job.id, "scheduled"); 
                  toast.success("Request accepted & scheduled!"); 
                  onOpenChange(false);
                }}
                className="w-full h-12 rounded-2xl gap-2 text-sm font-bold gradient-primary shadow-glow border-0"
              >
                <CalendarCheck className="h-4 w-4" /> Accept & Schedule
              </Button>
            )}

            {job.status === "scheduled" && (
              <Button
                onClick={() => { 
                  updateJobStatus(job.id, "in_progress"); 
                  toast.success("Job started!"); 
                  onOpenChange(false);
                }}
                className="w-full h-12 rounded-2xl gap-2 text-sm font-bold gradient-primary shadow-glow border-0"
              >
                <Play className="h-4 w-4" /> Start Job
              </Button>
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
      </SheetContent>
    </Sheet>
  );
};

export default JobDetailSheet;
