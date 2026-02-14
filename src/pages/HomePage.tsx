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
  const { jobs, events, payments } = useAppData();
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
    <div className="min-h-screen bg-background pb-20">
      {/* Status bar + Header */}
      <div className="bg-primary px-4 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-xs font-medium">{greeting()} 👋</p>
            <h1 className="text-lg font-bold text-primary-foreground mt-0.5">Dashboard</h1>
          </div>
          <button onClick={() => navigate("/profile")} className="h-8 w-8 rounded-full bg-primary-foreground/15 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Stats row — overlaps header */}
      <div className="px-4 -mt-3">
        <div className="flex gap-2">
          <div className="flex-1 bg-card rounded-xl p-3 text-center border border-border shadow-sm">
            <p className="text-lg font-bold">{todayJobs.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">TODAY</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-3 text-center border border-border shadow-sm">
            <p className="text-lg font-bold text-warning">{pendingPayments.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">UNPAID</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-3 text-center border border-border shadow-sm">
            <p className="text-lg font-bold text-success">₹{(totalEarnings / 1000).toFixed(0)}k</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">EARNED</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="flex gap-5 overflow-x-auto no-scrollbar">
          <QuickAction icon={Briefcase} label="Jobs" onClick={() => navigate("/jobs")} color="bg-primary/8 text-primary" />
          <QuickAction icon={Users} label="Clients" onClick={() => navigate("/clients")} color="bg-info/8 text-info" />
          <QuickAction icon={CalendarPlus} label="Events" onClick={() => navigate("/events")} color="bg-success/8 text-success" />
          <QuickAction icon={Wallet} label="Earnings" onClick={() => navigate("/payments")} color="bg-warning/8 text-warning" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-2 bg-muted mt-5" />

      {/* Today's Jobs */}
      <section className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Today's Schedule</h2>
          <button onClick={() => navigate("/jobs")} className="text-xs text-primary font-semibold flex items-center">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {todayJobs.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-6 text-center">
            <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No jobs today</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap + to schedule a new job</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      {upcomingJobs.length > 0 && (
        <>
          <div className="h-2 bg-muted mt-4" />
          <section className="px-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Upcoming</h2>
              <button onClick={() => navigate("/jobs")} className="text-xs text-primary font-semibold flex items-center">
                See all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {upcomingJobs.map(job => (
                <JobCard key={job.id} job={job} compact onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <>
          <div className="h-2 bg-muted mt-4" />
          <section className="px-4 mt-4">
            <h2 className="text-sm font-bold text-foreground mb-3">Collect Payments</h2>
            <div className="space-y-2">
              {pendingPayments.slice(0, 3).map(job => (
                <div key={job.id} onClick={() => setSelectedJob(job)} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 active:bg-muted/40 transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-warning/8 flex items-center justify-center shrink-0">
                    <Wallet className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{job.clientName}</p>
                    <p className="text-xs text-muted-foreground">{job.service}</p>
                  </div>
                  <p className="text-sm font-bold text-warning shrink-0">₹{(job.amount - job.paidAmount).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Active Events */}
      {events.filter(e => e.status !== "completed").length > 0 && (
        <>
          <div className="h-2 bg-muted mt-4" />
          <section className="px-4 mt-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-foreground">Active Events</h2>
              <button onClick={() => navigate("/events")} className="text-xs text-primary font-semibold flex items-center">
                See all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {events.filter(e => e.status !== "completed").map(event => {
              const progress = event.tasks.length > 0 ? (event.tasks.filter(t => t.completed).length / event.tasks.length) * 100 : 0;
              return (
                <div key={event.id} onClick={() => navigate("/events")} className="bg-card border border-border rounded-xl p-3 active:bg-muted/40 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.clientName} · {event.date}</p>
                    </div>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">{event.tasks.filter(t => t.completed).length}/{event.tasks.length} tasks</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}

      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default HomePage;
