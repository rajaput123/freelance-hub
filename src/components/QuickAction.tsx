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
        "flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-200 active:scale-95 min-w-[76px]",
        variant === "primary"
          ? "gradient-primary text-primary-foreground shadow-elevated"
          : "bg-card border border-border/60 text-foreground shadow-card hover:shadow-elevated"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-semibold leading-tight text-center">{label}</span>
    </button>
  );
};

export default QuickAction;
