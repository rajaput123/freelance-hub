import { useAppData } from "@/context/AppContext";
import { User, Briefcase, Users, Calendar, Wallet, Camera, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { clients, jobs, events, payments } = useAppData();
  const navigate = useNavigate();
  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/10 text-primary" },
    { label: "Clients", value: clients.length, icon: Users, color: "bg-info/10 text-info" },
    { label: "Events", value: events.length, icon: Calendar, color: "bg-success/10 text-success" },
    { label: "Earned", value: `₹${(totalEarnings / 1000).toFixed(0)}k`, icon: Wallet, color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pt-4 pb-10 rounded-b-[32px] shadow-glow">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-primary-foreground/70 mb-4">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-card flex items-center justify-center shadow-sm">
              <Camera className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Freelancer Pro</h1>
            <p className="text-[11px] text-primary-foreground/70 mt-0.5">Electrician & Event Decorator</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-5">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl p-3 text-center shadow-soft">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center mx-auto ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Contact Information</h2>
        <div className="bg-card rounded-2xl divide-y divide-border shadow-soft overflow-hidden">
          {[
            { icon: Mail, label: "Email", value: "freelancer@example.com" },
            { icon: Phone, label: "Phone", value: "+91 98765 43210" },
            { icon: MapPin, label: "Location", value: "Bangalore, India" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3.5 p-3.5">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-6 pb-4 font-medium">Version 1.0.0</p>
    </div>
  );
};

export default ProfilePage;
