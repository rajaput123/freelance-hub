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
    <div className="bg-primary px-4 pt-12 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="h-9 w-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Menu className="h-4.5 w-4.5 text-primary-foreground" />
          </button>
          <div>
            {greeting && <p className="text-primary-foreground/70 text-[11px] font-medium">{greeting}</p>}
            <h1 className="text-lg font-bold text-primary-foreground">{title}</h1>
          </div>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="h-9 w-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center active:scale-95 transition-transform"
          >
            {action.icon || <Plus className="h-4.5 w-4.5 text-primary-foreground" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
