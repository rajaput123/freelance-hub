import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, TrendingUp, Users, Briefcase } from "lucide-react";

const ReportsPage = () => {
  const { jobs, clients, payments, events } = useAppData();
  const navigate = useNavigate();

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const completedJobs = jobs.filter(j => j.status === "completed").length;
  const avgJobValue = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.amount, 0) / jobs.length) : 0;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-success/8 text-success" },
    { label: "Total Jobs", value: jobs.length, icon: Briefcase, color: "bg-primary/8 text-primary" },
    { label: "Completed", value: completedJobs, icon: BarChart3, color: "bg-info/8 text-info" },
    { label: "Avg Job Value", value: `₹${avgJobValue}`, icon: TrendingUp, color: "bg-warning/8 text-warning" },
    { label: "Active Clients", value: clients.length, icon: Users, color: "bg-accent text-accent-foreground" },
    { label: "Active Events", value: events.filter(e => e.status !== "completed").length, icon: BarChart3, color: "bg-info/8 text-info" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">Reports</h1>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${stat.color} mb-2`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
