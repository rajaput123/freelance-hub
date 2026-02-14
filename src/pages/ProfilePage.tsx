import { useAppData } from "@/context/AppContext";
import { User, ChevronRight, Briefcase, Users, Calendar, Wallet, Camera, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { clients, jobs, events, payments } = useAppData();
  const navigate = useNavigate();
  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/8 text-primary" },
    { label: "Clients", value: clients.length, icon: Users, color: "bg-info/8 text-info" },
    { label: "Events", value: events.length, icon: Calendar, color: "bg-success/8 text-success" },
    { label: "Earned", value: `₹${(totalEarnings / 1000).toFixed(0)}k`, icon: Wallet, color: "bg-warning/8 text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-4 pb-8">
        <button onClick={() => navigate(-1)} className="text-xs text-primary-foreground/70 mb-3">← Back</button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary-foreground/15 flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card flex items-center justify-center shadow-sm">
              <Camera className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
          <div>
            <h1 className="text-base font-bold text-primary-foreground">Freelancer Pro</h1>
            <p className="text-[11px] text-primary-foreground/70">Electrician & Event Decorator</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
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

      {/* Contact info */}
      <div className="px-4 mt-5">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact Information</h2>
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          <div className="flex items-center gap-3 p-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">freelancer@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">Bangalore, India</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-6 pb-4">Version 1.0.0</p>
    </div>
  );
};

export default ProfilePage;
