import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Plus, UserPlus, CalendarPlus, Briefcase, TrendingUp, Clock, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pb-8 pt-12 rounded-b-3xl">
        <p className="text-primary-foreground/70 text-sm">Good day 👋</p>
        <h1 className="text-2xl font-bold text-primary-foreground mt-1">Your Dashboard</h1>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-primary-foreground/15 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-primary-foreground">{todayJobs.length}</p>
            <p className="text-xs text-primary-foreground/70 mt-0.5">Today</p>
          </div>
          <div className="rounded-2xl bg-primary-foreground/15 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-primary-foreground">{pendingPayments.length}</p>
            <p className="text-xs text-primary-foreground/70 mt-0.5">Unpaid</p>
          </div>
          <div className="rounded-2xl bg-primary-foreground/15 p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-primary-foreground">₹{(totalEarnings / 1000).toFixed(0)}k</p>
            <p className="text-xs text-primary-foreground/70 mt-0.5">Earned</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4">
        {/* Quick Actions */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          <AddJobSheet
            trigger={
              <div className="flex flex-col items-center gap-2 rounded-2xl p-4 bg-card border border-border shadow-sm min-w-[80px] cursor-pointer active:scale-95 transition-all">
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">New Job</span>
              </div>
            }
          />
          <AddClientSheet
            trigger={
              <div className="flex flex-col items-center gap-2 rounded-2xl p-4 bg-card border border-border shadow-sm min-w-[80px] cursor-pointer active:scale-95 transition-all">
                <UserPlus className="h-6 w-6" />
                <span className="text-xs font-medium">Add Client</span>
              </div>
            }
          />
          <QuickAction icon={CalendarPlus} label="New Event" onClick={() => navigate("/events")} />
          <QuickAction icon={TrendingUp} label="Earnings" onClick={() => navigate("/payments")} />
        </div>

        {/* Today's Jobs */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Jobs
            </h2>
            <span className="text-sm text-muted-foreground">{todayJobs.length} jobs</span>
          </div>
          {todayJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
              <p>No jobs scheduled for today</p>
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
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-info" />
                Upcoming
              </h2>
              <button onClick={() => navigate("/jobs")} className="text-sm text-primary font-medium">View all</button>
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
          <section className="mt-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              Pending Payments
            </h2>
            <div className="space-y-2">
              {pendingPayments.slice(0, 3).map(job => (
                <div key={job.id} onClick={() => setSelectedJob(job)} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 cursor-pointer active:scale-[0.98] transition-all">
                  <div>
                    <p className="font-medium text-sm">{job.clientName}</p>
                    <p className="text-xs text-muted-foreground">{job.service}</p>
                  </div>
                  <p className="font-bold text-warning">₹{(job.amount - job.paidAmount).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events */}
        {events.length > 0 && (
          <section className="mt-6 mb-4">
            <h2 className="text-lg font-bold mb-3">Active Events</h2>
            {events.filter(e => e.status !== "completed").map(event => (
              <div key={event.id} onClick={() => navigate("/events")} className="rounded-2xl border border-border bg-card p-4 cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.clientName} · {event.date}</p>
                  </div>
                  <StatusBadge status={event.status} type="event" />
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{event.tasks.filter(t => t.completed).length}/{event.tasks.length} tasks</span>
                  <span className="font-semibold">₹{event.totalPaid.toLocaleString()} / ₹{event.budget.toLocaleString()}</span>
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
