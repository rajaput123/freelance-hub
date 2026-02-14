import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const ReportsPage = () => {
  const { jobs, clients, payments, events } = useAppData();
  const navigate = useNavigate();

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const completedJobs = jobs.filter(j => j.status === "completed").length;
  const avgJobValue = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.amount, 0) / jobs.length) : 0;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-success/10 text-success" },
    { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/10 text-primary" },
    { label: "Completed", value: completedJobs, icon: BarChart3, color: "bg-info/10 text-info" },
    { label: "Avg Job Value", value: `₹${avgJobValue}`, icon: TrendingUp, color: "bg-warning/10 text-warning" },
    { label: "Active Clients", value: clients.length, icon: Users, color: "bg-accent text-accent-foreground" },
    { label: "Active Events", value: events.filter(e => e.status !== "completed").length, icon: BarChart3, color: "bg-info/10 text-info" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Reports</h1>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-soft">
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center mb-3", stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
