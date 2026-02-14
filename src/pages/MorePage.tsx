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
    { label: "Events", icon: Calendar, path: "/more/events", color: "bg-info/10 text-info", desc: "Projects & events" },
    { label: "Services", icon: ShoppingBag, path: "/more/services", color: "bg-primary/10 text-primary", desc: "Your rates" },
    { label: "Clients", icon: Users, path: "/more/clients", color: "bg-accent text-accent-foreground", desc: "Directory" },
    { label: "Jobs", icon: Briefcase, path: "/more/jobs", color: "bg-success/10 text-success", desc: "All records" },
    { label: "Inventory", icon: Package, path: "/more/inventory", color: "bg-warning/10 text-warning", desc: `Stock${lowStockCount > 0 ? ` · ${lowStockCount} low` : ""}`, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { label: "Finance", icon: Wallet, path: "/more/finance", color: "bg-success/10 text-success", desc: "Payments" },
    { label: "Messages", icon: MessageSquare, path: "/more/communication", color: "bg-destructive/10 text-destructive", desc: `Updates${unreadCount > 0 ? ` · ${unreadCount} new` : ""}`, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: "Reports", icon: BarChart3, path: "/more/reports", color: "bg-info/10 text-info", desc: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="More" onMenuClick={onMenuClick} />

      <div className="px-4 -mt-3">
        <div className="grid grid-cols-2 gap-3">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="bg-card rounded-2xl p-4 text-left active:scale-[0.97] transition-all duration-200 shadow-soft relative overflow-hidden"
              >
                <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center mb-3", item.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-bold text-sm text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{item.desc}</p>
                {item.badge && (
                  <span className="absolute top-3 right-3 h-5 min-w-[20px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1.5">
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
