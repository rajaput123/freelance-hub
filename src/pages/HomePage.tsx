import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, CalendarPlus, TrendingUp, Clock, AlertCircle, ChevronRight, Wallet, Users, Zap } from "lucide-react";
import QuickAction from "@/components/QuickAction";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";
import { Job } from "@/data/types";

const HomePage = () => {
  const { jobs, clients, events, payments } = useAppData();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const todayJobs = jobs.filter(j => j.date === today);
  const upcomingJobs = jobs.filter(j => j.date > today && j.status === "scheduled").slice(0, 3);
  const pendingPayments = jobs.filter(j => j.paidAmount < j.amount && j.status !== "cancelled");
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="bg-primary px-5 pb-6 pt-11">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-[13px] font-medium">{greeting()} 👋</p>
            <h1 className="text-xl font-bold text-primary-foreground mt-0.5">Dashboard</h1>
          </div>
          <button onClick={() => navigate("/profile")} className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Stats Cards - overlapping header */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-card p-3 text-center shadow-sm border border-border/50">
            <p className="text-xl font-extrabold text-foreground">{todayJobs.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Today</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center shadow-sm border border-border/50">
            <p className="text-xl font-extrabold text-warning">{pendingPayments.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Unpaid</p>
          </div>
          <div className="rounded-2xl bg-card p-3 text-center shadow-sm border border-border/50">
            <p className="text-xl font-extrabold text-success">₹{(totalEarnings / 1000).toFixed(0)}k</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">Earned</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - PhonePe style circular grid */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold text-foreground">Quick Actions</p>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar pb-1">
          <QuickAction icon={Briefcase} label="My Jobs" onClick={() => navigate("/jobs")} color="bg-primary/10 text-primary" />
          <QuickAction icon={Users} label="Clients" onClick={() => navigate("/clients")} color="bg-info/10 text-info" />
          <QuickAction icon={CalendarPlus} label="Events" onClick={() => navigate("/events")} color="bg-success/10 text-success" />
          <QuickAction icon={Wallet} label="Earnings" onClick={() => navigate("/payments")} color="bg-warning/10 text-warning" />
          <QuickAction icon={Zap} label="Quick Add" onClick={() => {}} color="bg-accent text-accent-foreground" />
        </div>
      </div>

      {/* Today's Jobs */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-[14px] font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Today's Schedule
          </h2>
          <button onClick={() => navigate("/jobs")} className="text-[12px] text-primary font-semibold flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {todayJobs.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-semibold text-[14px]">No jobs today</p>
            <p className="text-[12px] text-muted-foreground mt-1">Tap + to schedule a new job</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      {upcomingJobs.length > 0 && (
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="text-[14px] font-bold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-info" />
              Upcoming
            </h2>
            <button onClick={() => navigate("/jobs")} className="text-[12px] text-primary font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingJobs.map(job => (
              <JobCard key={job.id} job={job} compact onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="text-[14px] font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Collect Payments
            </h2>
          </div>
          <div className="space-y-2">
            {pendingPayments.slice(0, 3).map(job => (
              <div key={job.id} onClick={() => setSelectedJob(job)} className="flex items-center gap-3 rounded-2xl bg-card border border-border/50 p-3.5 cursor-pointer active:scale-[0.98] transition-all shadow-sm">
                <div className="h-9 w-9 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                  <Wallet className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] truncate">{job.clientName}</p>
                  <p className="text-[11px] text-muted-foreground">{job.service}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-warning text-[14px]">₹{(job.amount - job.paidAmount).toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">due</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Events */}
      {events.filter(e => e.status !== "completed").length > 0 && (
        <section className="px-4 mt-6 mb-4">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h2 className="text-[14px] font-bold">Active Events</h2>
            <button onClick={() => navigate("/events")} className="text-[12px] text-primary font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {events.filter(e => e.status !== "completed").map(event => {
            const progress = event.tasks.length > 0 ? (event.tasks.filter(t => t.completed).length / event.tasks.length) * 100 : 0;
            return (
              <div key={event.id} onClick={() => navigate("/events")} className="rounded-2xl bg-card border border-border/50 p-4 cursor-pointer active:scale-[0.98] transition-all shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-[15px] truncate">{event.title}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{event.clientName} · {event.date}</p>
                  </div>
                  <StatusBadge status={event.status} type="event" />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground font-medium">{event.tasks.filter(t => t.completed).length}/{event.tasks.length} tasks</span>
                    <span className="font-bold text-primary">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[13px] pt-2.5 border-t border-border/40">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-bold">₹{event.totalPaid.toLocaleString()} / ₹{event.budget.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default HomePage;
