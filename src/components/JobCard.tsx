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
        "bg-card border border-border rounded-xl p-3 active:bg-muted/40 transition-colors",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-primary/8 text-primary flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
          {job.clientName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          {/* Top row: name + badge */}
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-foreground truncate">{job.clientName}</p>
            <StatusBadge status={job.status} />
          </div>
          {/* Service */}
          <p className="text-xs text-muted-foreground mt-0.5">{job.service}</p>

          {/* Meta row */}
          {!compact && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {job.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-foreground">₹{job.amount.toLocaleString()}</span>
            <span className={cn("text-xs font-medium", isPaid ? "text-success" : "text-warning")}>
              {isPaid ? "Paid" : `₹${job.paidAmount.toLocaleString()} paid`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
