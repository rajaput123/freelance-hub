import { Job } from "@/data/types";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onClick?: () => void;
}

const JobCard = ({ job, compact = false, onClick }: JobCardProps) => {
  const isPaid = job.paidAmount >= job.amount;
  const initial = job.clientName.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl bg-card p-4 transition-all duration-150 active:scale-[0.98]",
        "border border-border/70 shadow-sm",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-[15px] text-card-foreground truncate leading-tight">{job.clientName}</p>
              <p className="text-[13px] text-muted-foreground mt-0.5">{job.service}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          {!compact && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[15px] font-bold text-card-foreground flex items-center">
              <IndianRupee className="h-3.5 w-3.5" />{job.amount.toLocaleString()}
            </span>
            <span className={cn(
              "text-[12px] font-semibold",
              isPaid ? "text-success" : "text-warning"
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
