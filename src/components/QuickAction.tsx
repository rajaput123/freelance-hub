import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

const QuickAction = ({ icon: Icon, label, onClick, color = "bg-primary/10 text-primary" }: QuickActionProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 transition-all active:scale-90 min-w-[64px]"
    >
      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", color)}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
      </div>
      <span className="text-[11px] font-semibold text-foreground/80 leading-tight text-center">{label}</span>
    </button>
  );
};

export default QuickAction;
