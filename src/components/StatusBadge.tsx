import { JobStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-info/10 text-info border-info/20" },
  in_progress: { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const eventStatusConfig: Record<string, { label: string; className: string }> = {
  planning: { label: "Planning", className: "bg-info/10 text-info border-info/20" },
  in_progress: { label: "In Progress", className: "bg-warning/10 text-warning border-warning/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20" },
};

interface StatusBadgeProps {
  status: string;
  type?: "job" | "event";
}

const StatusBadge = ({ status, type = "job" }: StatusBadgeProps) => {
  const config = type === "event" ? eventStatusConfig[status] : statusConfig[status as JobStatus];
  if (!config) return null;

  return (
    <span className={cn("inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase", config.className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
