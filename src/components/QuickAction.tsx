import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

const QuickAction = ({ icon: Icon, label, onClick, color = "bg-primary/5 text-primary border border-primary/10" }: QuickActionProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2.5 active:scale-95 transition-all duration-200 min-w-[60px]"
    >
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", color)}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <span className="text-[11px] font-medium text-foreground/70 leading-tight text-center">{label}</span>
    </button>
  );
};

export default QuickAction;
