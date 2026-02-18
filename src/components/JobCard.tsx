import { Job } from "@/data/types";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Wallet, Play, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  compact?: boolean;
  variant?: "default" | "compact" | "payment" | "active";
  onClick?: () => void;
  onStartJob?: (e?: React.MouseEvent) => void;
  onComplete?: (e?: React.MouseEvent) => void;
}

const JobCard = ({ job, compact = false, variant = "default", onClick, onStartJob, onComplete }: JobCardProps) => {
  const isPaid = job.paidAmount >= job.amount;
  const showDetails = !compact && variant !== "payment" && variant !== "compact";

  // Variant-specific styles
  const variantStyles = {
    default: "bg-white rounded-2xl p-4 shadow-lg border border-border/20 hover:shadow-xl",
    compact: "bg-white rounded-xl p-3 shadow-md border border-border/20 hover:shadow-lg",
    payment: "bg-white rounded-2xl p-4 shadow-lg border border-border/20 hover:shadow-xl",
    active: "bg-primary/5 rounded-2xl p-4 shadow-lg border-2 border-primary/20 hover:border-primary/30",
  };

  const avatarSizes = {
    default: "h-14 w-14 rounded-2xl text-base",
    compact: "h-12 w-12 rounded-xl text-sm",
    payment: "h-14 w-14 rounded-2xl text-base",
    active: "h-14 w-14 rounded-2xl text-base",
  };

  const textSizes = {
    default: { title: "text-base", service: "text-sm", amount: "text-base" },
    compact: { title: "text-sm", service: "text-xs", amount: "text-sm" },
    payment: { title: "text-base", service: "text-sm", amount: "text-base" },
    active: { title: "text-base", service: "text-sm", amount: "text-base" },
  };

  // Payment variant uses Wallet icon instead of avatar
  if (variant === "payment") {
    const pendingAmount = job.amount - job.paidAmount;
    return (
      <div
        onClick={onClick}
        className={cn(
          variantStyles[variant],
          "flex items-center gap-4 active:scale-[0.98] transition-all duration-200",
          onClick && "cursor-pointer"
        )}
      >
        <div className="h-14 w-14 rounded-2xl bg-warning/15 flex items-center justify-center shrink-0">
          <Wallet className="h-6 w-6 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-bold truncate mb-0.5", textSizes[variant].title)}>{job.clientName || job.freelancerName || "Unknown"}</p>
          <p className={cn("text-muted-foreground font-medium", textSizes[variant].service)}>{job.service || job.taskName || "Service"}</p>
        </div>
        <p className={cn("font-bold text-warning shrink-0", textSizes[variant].amount)} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ₹{pendingAmount.toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        variantStyles[variant],
        "active:scale-[0.98] transition-all duration-200",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          avatarSizes[variant],
          variant === "active" ? "gradient-primary text-primary-foreground shadow-md" : "gradient-primary text-primary-foreground shadow-md",
          "flex items-center justify-center font-bold shrink-0 mt-0.5"
        )}>
          {(job.clientName || job.freelancerName || "?").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className={cn("font-bold text-foreground truncate", textSizes[variant].title)}>{job.clientName || job.freelancerName || "Unknown"}</p>
            <StatusBadge status={job.status} />
          </div>
          <p className={cn("text-muted-foreground font-medium mb-2.5", textSizes[variant].service)}>{job.service}</p>

          {showDetails && (
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5 font-medium">
                <Clock className="h-3.5 w-3.5" /> {job.time}
              </span>
              <span className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5 font-medium">
                <MapPin className="h-3.5 w-3.5" /> {job.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <span className={cn("font-bold text-foreground", textSizes[variant].amount)} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ₹{job.amount.toLocaleString()}
            </span>
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-lg",
              isPaid ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
            )}>
              {isPaid ? "✓ Paid" : `₹${job.paidAmount.toLocaleString()} paid`}
            </span>
          </div>

          {/* Action Buttons - Show for scheduled and in_progress jobs */}
          {job.status === "scheduled" && onStartJob && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartJob(e);
              }}
              className="w-full h-10 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Play className="h-4 w-4" />
              Start Job
            </button>
          )}

          {job.status === "in_progress" && onComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(e);
              }}
              className="w-full h-10 rounded-xl bg-success text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-success/90"
            >
              <CheckCircle className="h-4 w-4" />
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
