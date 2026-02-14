import { JobStatus } from "@/data/types";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

const statusConfig: Record<JobStatus, { label: string; dot: string; bg: string; text: string }> = {
  scheduled: { label: "Scheduled", dot: "bg-info", bg: "bg-info/8", text: "text-info" },
  in_progress: { label: "Active", dot: "bg-warning", bg: "bg-warning/8", text: "text-warning" },
  completed: { label: "Done", dot: "bg-success", bg: "bg-success/8", text: "text-success" },
  cancelled: { label: "Cancelled", dot: "bg-destructive", bg: "bg-destructive/8", text: "text-destructive" },
};

export const eventStatusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  planning: { label: "Planning", dot: "bg-info", bg: "bg-info/8", text: "text-info" },
  in_progress: { label: "Active", dot: "bg-warning", bg: "bg-warning/8", text: "text-warning" },
  completed: { label: "Done", dot: "bg-success", bg: "bg-success/8", text: "text-success" },
};

interface StatusBadgeProps {
  status: string;
  type?: "job" | "event";
}

const StatusBadge = ({ status, type = "job" }: StatusBadgeProps) => {
  const config = type === "event" ? eventStatusConfig[status] : statusConfig[status as JobStatus];
  if (!config) return null;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", config.bg, config.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
