import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

const QuickAction = ({ icon: Icon, label, onClick, variant = "secondary" }: QuickActionProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl p-4 transition-all active:scale-95 min-w-[80px]",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "bg-card border border-border text-foreground shadow-sm"
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium leading-tight text-center">{label}</span>
    </button>
  );
};

export default QuickAction;
