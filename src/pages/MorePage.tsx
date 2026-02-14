import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Calendar, ShoppingBag, Package, Wallet, Megaphone, BarChart3, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface MorePageProps {
  onMenuClick: () => void;
}

const features = [
  { label: "Events / Projects", icon: Calendar, path: "/more/events", color: "bg-info/8 text-info", desc: "Manage events & projects" },
  { label: "Service Catalog", icon: ShoppingBag, path: "/more/services", color: "bg-primary/8 text-primary", desc: "Your services & rates" },
  { label: "Clients", icon: Users, path: "/more/clients", color: "bg-accent text-accent-foreground", desc: "Client directory" },
  { label: "Jobs", icon: Briefcase, path: "/more/jobs", color: "bg-success/8 text-success", desc: "All job records" },
  { label: "Inventory", icon: Package, path: "/more/inventory", color: "bg-warning/8 text-warning", desc: "Materials & stock" },
  { label: "Finance", icon: Wallet, path: "/more/finance", color: "bg-success/8 text-success", desc: "Earnings & payments" },
  { label: "Announcements", icon: Megaphone, path: "/more/announcements", color: "bg-destructive/8 text-destructive", desc: "Messages & updates" },
  { label: "Reports", icon: BarChart3, path: "/more/reports", color: "bg-info/8 text-info", desc: "Analytics & insights" },
];

const MorePage = ({ onMenuClick }: MorePageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="More" onMenuClick={onMenuClick} />

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="bg-card border border-border rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", item.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MorePage;
