import { JobStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<JobStatus, { label: string; className: string; dot: string }> = {
  pending: { label: "New", className: "bg-accent text-accent-foreground", dot: "bg-primary" },
  scheduled: { label: "Scheduled", className: "bg-info/10 text-info", dot: "bg-info" },
  in_progress: { label: "Active", className: "bg-warning/10 text-warning", dot: "bg-warning" },
  completed: { label: "Done", className: "bg-success/10 text-success", dot: "bg-success" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
};

export const eventStatusConfig: Record<string, { label: string; className: string; dot: string }> = {
  planning: { label: "Planning", className: "bg-info/10 text-info", dot: "bg-info" },
  in_progress: { label: "In Progress", className: "bg-warning/10 text-warning", dot: "bg-warning" },
  completed: { label: "Completed", className: "bg-success/10 text-success", dot: "bg-success" },
};

interface StatusBadgeProps {
  status: string;
  type?: "job" | "event";
}

const StatusBadge = ({ status, type = "job" }: StatusBadgeProps) => {
  const config = type === "event" ? eventStatusConfig[status] : statusConfig[status as JobStatus];
  if (!config) return null;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
