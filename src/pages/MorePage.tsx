import { useNavigate } from "react-router-dom";
import { useAppData } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { Calendar, ShoppingBag, Package, Wallet, MessageSquare, BarChart3, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface MorePageProps {
  onMenuClick: () => void;
}

const MorePage = ({ onMenuClick }: MorePageProps) => {
  const navigate = useNavigate();
  const { messages, inventory } = useAppData();

  const unreadCount = messages.filter(m => !m.read).length;
  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

  const features = [
    { label: "Events / Projects", icon: Calendar, path: "/more/events", color: "bg-info/8 text-info", desc: "Manage events & projects" },
    { label: "Service Catalog", icon: ShoppingBag, path: "/more/services", color: "bg-primary/8 text-primary", desc: "Your services & rates" },
    { label: "Clients", icon: Users, path: "/more/clients", color: "bg-accent text-accent-foreground", desc: "Client directory" },
    { label: "Jobs", icon: Briefcase, path: "/more/jobs", color: "bg-success/8 text-success", desc: "All job records" },
    { label: "Inventory", icon: Package, path: "/more/inventory", color: "bg-warning/8 text-warning", desc: `Materials & stock${lowStockCount > 0 ? ` · ${lowStockCount} low` : ""}`, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { label: "Finance", icon: Wallet, path: "/more/finance", color: "bg-success/8 text-success", desc: "Earnings & payments" },
    { label: "Communication", icon: MessageSquare, path: "/more/communication", color: "bg-destructive/8 text-destructive", desc: `Messages & updates${unreadCount > 0 ? ` · ${unreadCount} new` : ""}`, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: "Reports", icon: BarChart3, path: "/more/reports", color: "bg-info/8 text-info", desc: "Analytics & insights" },
  ];

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
                className="bg-card border border-border rounded-xl p-4 text-left active:scale-[0.98] transition-transform relative"
              >
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", item.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                {item.badge && (
                  <span className="absolute top-3 right-3 h-5 min-w-[20px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MorePage;
