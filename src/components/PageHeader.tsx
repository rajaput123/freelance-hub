import { Menu, Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  onMenuClick: () => void;
  greeting?: string;
  action?: {
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

const PageHeader = ({ title, onMenuClick, greeting, action }: PageHeaderProps) => {
  return (
    <div className="gradient-primary px-5 pt-4 pb-7 rounded-b-[28px] shadow-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="h-10 w-10 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            <Menu className="h-[18px] w-[18px] text-primary-foreground" />
          </button>
          <div>
            {greeting && <p className="text-primary-foreground/75 text-[11px] font-medium tracking-wide">{greeting}</p>}
            <h1 className="text-xl font-bold text-primary-foreground tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h1>
          </div>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="h-10 w-10 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            {action.icon || <Plus className="h-[18px] w-[18px] text-primary-foreground" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
