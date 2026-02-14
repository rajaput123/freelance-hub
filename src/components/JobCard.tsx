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
        "bg-card rounded-2xl p-3.5 shadow-soft active:scale-[0.98] transition-all duration-200",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-glow/50">
          {job.clientName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-sm text-foreground truncate">{job.clientName}</p>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{job.service}</p>

          {!compact && (
            <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
                <Clock className="h-3 w-3" /> {job.time}
              </span>
              <span className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{job.amount.toLocaleString()}</span>
            <span className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full",
              isPaid ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            )}>
              {isPaid ? "✓ Paid" : `₹${job.paidAmount.toLocaleString()} paid`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
