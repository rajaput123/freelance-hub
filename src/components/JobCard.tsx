import { Job } from "@/data/types";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onClick?: () => void;
}

const JobCard = ({ job, compact = false, onClick }: JobCardProps) => {
  const isPaid = job.paidAmount >= job.amount;

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all duration-200 active:scale-[0.98] hover:shadow-elevated",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-card-foreground truncate">{job.clientName}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{job.service}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {job.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-lg font-bold text-card-foreground">₹{job.amount.toLocaleString()}</span>
        <span className={cn(
          "text-sm font-semibold px-2 py-0.5 rounded-lg",
          isPaid ? "text-success bg-success/10" : "text-warning bg-warning/10"
        )}>
          {isPaid ? "Paid ✓" : `₹${job.paidAmount.toLocaleString()} paid`}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
