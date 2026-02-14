import { useAppData } from "@/context/AppContext";
import { User, ChevronRight, Briefcase, Users, Calendar, Wallet, Settings, Bell, Shield, HelpCircle, LogOut, Star } from "lucide-react";

const ProfilePage = () => {
  const { clients, jobs, events, payments } = useAppData();
  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/8 text-primary" },
    { label: "Clients", value: clients.length, icon: Users, color: "bg-info/8 text-info" },
    { label: "Events", value: events.length, icon: Calendar, color: "bg-success/8 text-success" },
    { label: "Earned", value: `₹${(totalEarnings / 1000).toFixed(0)}k`, icon: Wallet, color: "bg-warning/8 text-warning" },
  ];

  const menuItems = [
    { label: "Notifications", icon: Bell, subtitle: "Manage alerts" },
    { label: "Business Settings", icon: Settings, subtitle: "Services, rates & more" },
    { label: "Privacy & Security", icon: Shield, subtitle: "Account protection" },
    { label: "Rate Us", icon: Star, subtitle: "Share your feedback" },
    { label: "Help & Support", icon: HelpCircle, subtitle: "FAQs and contact" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile header */}
      <div className="bg-primary px-4 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary-foreground">Freelancer Pro</h1>
            <p className="text-xs text-primary-foreground/70">freelancer@example.com</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-3">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-2.5 text-center shadow-sm">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center mx-auto ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold mt-1">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-2 bg-muted mt-4" />

      {/* Menu */}
      <div className="px-4 mt-3">
        {menuItems.map((item, i) => (
          <button key={i} className="flex items-center gap-3 w-full py-3 text-left active:bg-muted/40 transition-colors border-b border-border last:border-0">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-2 bg-muted mt-1" />

      {/* Logout */}
      <div className="px-4 mt-3">
        <button className="flex items-center gap-3 w-full py-3 text-left active:bg-destructive/5 transition-colors">
          <div className="h-9 w-9 rounded-lg bg-destructive/8 flex items-center justify-center">
            <LogOut className="h-4 w-4 text-destructive" />
          </div>
          <span className="font-semibold text-sm text-destructive">Log Out</span>
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-4 pb-4">Version 1.0.0</p>
    </div>
  );
};

export default ProfilePage;
