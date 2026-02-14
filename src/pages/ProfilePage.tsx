import { useAppData } from "@/context/AppContext";
import { User, ChevronRight, Briefcase, Users, Calendar, Wallet, Settings, Bell, Shield, HelpCircle, LogOut, Star } from "lucide-react";

const ProfilePage = () => {
  const { clients, jobs, events, payments } = useAppData();
  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/10 text-primary" },
    { label: "Clients", value: clients.length, icon: Users, color: "bg-info/10 text-info" },
    { label: "Events", value: events.length, icon: Calendar, color: "bg-success/10 text-success" },
    { label: "Earnings", value: `₹${(totalEarnings / 1000).toFixed(0)}k`, icon: Wallet, color: "bg-warning/10 text-warning" },
  ];

  const menuItems = [
    { label: "Notifications", icon: Bell, subtitle: "Manage alerts" },
    { label: "Business Settings", icon: Settings, subtitle: "Services, rates & more" },
    { label: "Privacy & Security", icon: Shield, subtitle: "Account protection" },
    { label: "Rate Us", icon: Star, subtitle: "Share your feedback" },
    { label: "Help & Support", icon: HelpCircle, subtitle: "FAQs and contact" },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Profile header */}
      <div className="bg-primary px-5 pb-8 pt-11">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground">Freelancer Pro</h1>
            <p className="text-[13px] text-primary-foreground/70">freelancer@example.com</p>
            <p className="text-[12px] text-primary-foreground/50 mt-0.5">Member since Jan 2024</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 p-3.5 shadow-sm flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold leading-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-5">
        <div className="rounded-2xl bg-card border border-border/50 overflow-hidden shadow-sm">
          {menuItems.map((item, i) => (
            <button key={i} className="flex items-center gap-3 w-full px-4 py-3.5 text-left active:bg-muted/50 transition-colors border-b border-border/30 last:border-0">
              <div className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                <item.icon className="h-[18px] w-[18px] text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px]">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button className="flex items-center gap-3 w-full rounded-2xl bg-card border border-destructive/20 px-4 py-3.5 active:bg-destructive/5 transition-colors">
          <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="h-[18px] w-[18px] text-destructive" />
          </div>
          <span className="font-semibold text-[14px] text-destructive">Log Out</span>
        </button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-6">Version 1.0.0</p>
    </div>
  );
};

export default ProfilePage;
