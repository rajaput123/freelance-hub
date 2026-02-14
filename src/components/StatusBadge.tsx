import { JobStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-info/15 text-info" },
  in_progress: { label: "In Progress", className: "bg-warning/15 text-warning" },
  completed: { label: "Completed", className: "bg-success/15 text-success" },
  cancelled: { label: "Cancelled", className: "bg-destructive/15 text-destructive" },
};

export const eventStatusConfig: Record<string, { label: string; className: string }> = {
  planning: { label: "Planning", className: "bg-info/15 text-info" },
  in_progress: { label: "In Progress", className: "bg-warning/15 text-warning" },
  completed: { label: "Completed", className: "bg-success/15 text-success" },
};

interface StatusBadgeProps {
  status: string;
  type?: "job" | "event";
}

const StatusBadge = ({ status, type = "job" }: StatusBadgeProps) => {
  const config = type === "event" ? eventStatusConfig[status] : statusConfig[status as JobStatus];
  if (!config) return null;

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
