import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Plus, UserPlus, CalendarPlus, TrendingUp, Clock, AlertCircle, Briefcase, Sparkles } from "lucide-react";
import QuickAction from "@/components/QuickAction";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import AddJobSheet from "@/components/AddJobSheet";
import AddClientSheet from "@/components/AddClientSheet";
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

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="gradient-header px-5 pb-10 pt-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)'}} />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-foreground/60" />
            <p className="text-primary-foreground/70 text-sm font-medium">Good day</p>
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground mt-1 tracking-tight">Your Dashboard</h1>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: todayJobs.length, label: "Today" },
              { value: pendingPayments.length, label: "Unpaid" },
              { value: `₹${(totalEarnings / 1000).toFixed(0)}k`, label: "Earned" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/10 p-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-[11px] text-primary-foreground/60 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5">
        {/* Quick Actions */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          <AddJobSheet
            trigger={
              <div className="flex flex-col items-center gap-2 rounded-2xl p-4 gradient-primary text-primary-foreground shadow-elevated min-w-[76px] cursor-pointer active:scale-95 transition-all duration-200">
                <Plus className="h-5 w-5" />
                <span className="text-[11px] font-semibold">New Job</span>
              </div>
            }
          />
          <AddClientSheet
            trigger={
              <div className="flex flex-col items-center gap-2 rounded-2xl p-4 bg-card border border-border/60 shadow-card min-w-[76px] cursor-pointer active:scale-95 transition-all duration-200">
                <UserPlus className="h-5 w-5" />
                <span className="text-[11px] font-semibold">Add Client</span>
              </div>
            }
          />
          <QuickAction icon={CalendarPlus} label="New Event" onClick={() => navigate("/events")} />
          <QuickAction icon={TrendingUp} label="Earnings" onClick={() => navigate("/payments")} />
        </div>

        {/* Today's Jobs */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2 tracking-tight">
              <div className="p-1.5 rounded-lg bg-accent">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              Today's Jobs
            </h2>
            <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-lg">{todayJobs.length} jobs</span>
          </div>
          {todayJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center text-muted-foreground">
              <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <p className="font-medium">No jobs for today</p>
              <p className="text-sm mt-1">Enjoy your free time! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayJobs.map(job => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming */}
        {upcomingJobs.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold flex items-center gap-2 tracking-tight">
                <div className="p-1.5 rounded-lg bg-info/10">
                  <Briefcase className="h-4 w-4 text-info" />
                </div>
                Upcoming
              </h2>
              <button onClick={() => navigate("/jobs")} className="text-xs text-primary font-semibold hover:underline">View all →</button>
            </div>
            <div className="space-y-3">
              {upcomingJobs.map(job => (
                <JobCard key={job.id} job={job} compact onClick={() => setSelectedJob(job)} />
              ))}
            </div>
          </section>
        )}

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <section className="mt-7">
            <h2 className="text-base font-bold flex items-center gap-2 mb-3 tracking-tight">
              <div className="p-1.5 rounded-lg bg-warning/10">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              Pending Payments
            </h2>
            <div className="space-y-2">
              {pendingPayments.slice(0, 3).map(job => (
                <div key={job.id} onClick={() => setSelectedJob(job)} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-3.5 cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-card hover:shadow-elevated">
                  <div>
                    <p className="font-semibold text-sm">{job.clientName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{job.service}</p>
                  </div>
                  <span className="font-bold text-warning text-sm bg-warning/10 px-2.5 py-1 rounded-lg">₹{(job.amount - job.paidAmount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events */}
        {events.length > 0 && (
          <section className="mt-7 mb-4">
            <h2 className="text-base font-bold mb-3 tracking-tight">Active Events</h2>
            {events.filter(e => e.status !== "completed").map(event => (
              <div key={event.id} onClick={() => navigate("/events")} className="rounded-2xl border border-border/60 bg-card p-4 cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-card hover:shadow-elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{event.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{event.clientName} · {event.date}</p>
                  </div>
                  <StatusBadge status={event.status} type="event" />
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">{event.tasks.filter(t => t.completed).length}/{event.tasks.length} tasks</span>
                  <span className="font-bold ml-auto">₹{event.totalPaid.toLocaleString()} / ₹{event.budget.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default HomePage;
