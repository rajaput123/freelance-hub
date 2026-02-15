import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, CalendarPlus, Clock, ChevronRight, Wallet, Users, Inbox, Bell, TrendingUp, Menu, Calendar, Package, MessageSquare } from "lucide-react";
import QuickAction from "@/components/QuickAction";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import SectionHeader from "@/components/SectionHeader";
import { useState } from "react";
import { Job } from "@/data/types";

interface HomePageProps {
  onMenuClick: () => void;
}

const HomePage = ({ onMenuClick }: HomePageProps) => {
  const { jobs, events, payments, messages } = useAppData();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");

  const today = new Date().toISOString().split("T")[0];
  
  // Filter jobs based on search
  const filterJobs = (jobList: Job[]) => {
    if (!search) return jobList;
    const searchLower = search.toLowerCase();
    return jobList.filter(j => 
      j.clientName.toLowerCase().includes(searchLower) || 
      j.service.toLowerCase().includes(searchLower)
    );
  };

  const todayJobs = filterJobs(jobs.filter(j => j.date === today && j.status !== "pending" && j.status !== "cancelled"));
  const upcomingJobs = filterJobs(jobs.filter(j => j.date > today && j.status === "scheduled")).slice(0, 3);
  const pendingPayments = filterJobs(jobs.filter(j => j.paidAmount < j.amount && j.status !== "cancelled" && j.status !== "pending"));
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const newRequests = filterJobs(jobs.filter(j => j.status === "pending"));
  const activeTasks = filterJobs(jobs.filter(j => j.status === "in_progress"));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning ☀️";
    if (h < 17) return "Good Afternoon";
    return "Good Evening 🌙";
  };

  // Consistent spacing constants
  const sectionSpacing = "px-4 mt-6";
  const cardListSpacing = "space-y-3";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-24">
      {/* Hero Header - PhonePe/Swiggy Style */}
      <div className="gradient-primary rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-6">
          {/* Top Row - Menu, Title */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onMenuClick}
              className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center active:scale-95 transition-all duration-200"
            >
              <Menu className="h-5 w-5 text-primary-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-primary-foreground/80 text-xs font-medium mb-0.5">{greeting()}</p>
              <h1 className="text-2xl font-bold text-primary-foreground tracking-tight truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Small Compact Cards (PhonePe Style) */}
      <div className="px-4 -mt-6 pt-2">
        <div className="bg-white rounded-2xl p-3 shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: todayJobs.length, label: "Today", icon: Briefcase, color: "text-primary", iconBg: "bg-primary/10" },
              { value: newRequests.length, label: "New", icon: Inbox, color: "text-primary", iconBg: "bg-primary/10" },
              { value: pendingPayments.length, label: "Unpaid", icon: Wallet, color: "text-warning", iconBg: "bg-warning/10" },
              { value: `₹${(totalEarnings / 1000).toFixed(0)}k`, label: "Earned", icon: TrendingUp, color: "text-success", iconBg: "bg-success/10" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <div className={`${s.iconBg} h-10 w-10 rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className={`text-sm font-bold ${s.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
                  <p className="text-[9px] text-muted-foreground font-semibold">{s.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions - Small Grid Cards (PhonePe Payment List Style) */}
      <div className="px-4 mt-4">
        <h2 className="text-base font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Clients", onClick: () => navigate("/more/clients"), color: "text-info", bg: "bg-info/10" },
            { icon: CalendarPlus, label: "Events", onClick: () => navigate("/more/events"), color: "text-success", bg: "bg-success/10" },
            { icon: Wallet, label: "Finance", onClick: () => navigate("/more/finance"), color: "text-warning", bg: "bg-warning/10" },
            { icon: Calendar, label: "Calendar", onClick: () => navigate("/calendar"), color: "text-primary", bg: "bg-primary/10" },
            { icon: Package, label: "Inventory", onClick: () => navigate("/more/inventory"), color: "text-info", bg: "bg-info/10" },
            { icon: MessageSquare, label: "Messages", onClick: () => navigate("/more/communication"), color: "text-success", bg: "bg-success/10" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className={`${action.bg} h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm`}>
                  <Icon className={`h-6 w-6 ${action.color}`} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active tasks - Rapido Style (Simple, clear with active variant) */}
      {activeTasks.length > 0 && (
        <section className={sectionSpacing}>
          <SectionHeader title="Active Tasks" seeAllPath="/requests" />
          <div className={cardListSpacing}>
            {activeTasks.slice(0, 2).map(job => (
              <JobCard key={job.id} job={job} variant="active" onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      {/* Today's Schedule - Zomato Style (Clean cards, good spacing) */}
      <section className={sectionSpacing}>
        <SectionHeader title="Today's Schedule" seeAllPath="/calendar" />
        {todayJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
            <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-bold text-foreground mb-1">No jobs today</p>
            <p className="text-sm text-muted-foreground">New requests will appear here</p>
          </div>
        ) : (
          <div className={cardListSpacing}>
            {todayJobs.map(job => (
              <JobCard key={job.id} job={job} variant="default" onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming - Rapido Style (Compact variant for quick scanning) */}
      {upcomingJobs.length > 0 && (
        <section className={sectionSpacing}>
          <SectionHeader title="Upcoming" seeAllPath="/calendar" />
          <div className={cardListSpacing}>
            {upcomingJobs.map(job => (
              <JobCard key={job.id} job={job} variant="compact" compact onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      {/* Pending Payments - PhonePe Style (Payment variant with icon focus) */}
      {pendingPayments.length > 0 && (
        <section className={sectionSpacing}>
          <SectionHeader title="Collect Payments" seeAllPath="/more/finance" />
          <div className={cardListSpacing}>
            {pendingPayments.slice(0, 3).map(job => (
              <JobCard key={job.id} job={job} variant="payment" onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />

      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default HomePage;
