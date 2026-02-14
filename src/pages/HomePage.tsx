import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, CalendarPlus, Clock, ChevronRight, Wallet, Users, ClipboardList, Plus, Inbox, Bell, TrendingUp } from "lucide-react";
import QuickAction from "@/components/QuickAction";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import PageHeader from "@/components/PageHeader";
import AddJobSheet from "@/components/AddJobSheet";
import { useState } from "react";
import { Job } from "@/data/types";

interface HomePageProps {
  onMenuClick: () => void;
}

const HomePage = ({ onMenuClick }: HomePageProps) => {
  const { jobs, events, payments, messages } = useAppData();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const todayJobs = jobs.filter(j => j.date === today && j.status !== "pending" && j.status !== "cancelled");
  const upcomingJobs = jobs.filter(j => j.date > today && j.status === "scheduled").slice(0, 3);
  const pendingPayments = jobs.filter(j => j.paidAmount < j.amount && j.status !== "cancelled" && j.status !== "pending");
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const newRequests = jobs.filter(j => j.status === "pending");
  const activeTasks = jobs.filter(j => j.status === "in_progress");

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning ☀️";
    if (h < 17) return "Good Afternoon";
    return "Good Evening 🌙";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Dashboard"
        greeting={greeting()}
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-[18px] w-[18px] text-primary-foreground" /> }}
      />

      {/* Stats row */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: todayJobs.length, label: "TODAY", color: "text-foreground" },
            { value: newRequests.length, label: "NEW", color: "text-primary" },
            { value: pendingPayments.length, label: "UNPAID", color: "text-warning" },
            { value: `₹${(totalEarnings / 1000).toFixed(0)}k`, label: "EARNED", color: "text-success" },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-2xl p-3 text-center shadow-soft">
              <p className={`text-xl font-bold ${s.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
              <p className="text-[9px] text-muted-foreground font-semibold mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-4 gap-3">
          <QuickAction icon={ClipboardList} label="Request" onClick={() => setShowAddJob(true)} color="bg-primary/10 text-primary" />
          <QuickAction icon={Users} label="Clients" onClick={() => navigate("/more/clients")} color="bg-info/10 text-info" />
          <QuickAction icon={CalendarPlus} label="Events" onClick={() => navigate("/more/events")} color="bg-success/10 text-success" />
          <QuickAction icon={Wallet} label="Finance" onClick={() => navigate("/more/finance")} color="bg-warning/10 text-warning" />
        </div>
      </div>

      {/* New requests alert */}
      {newRequests.length > 0 && (
        <section className="px-4 mt-5">
          <button
            onClick={() => navigate("/requests")}
            className="w-full gradient-primary rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-all duration-200 shadow-glow"
          >
            <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <Inbox className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-primary-foreground">{newRequests.length} new request{newRequests.length > 1 ? "s" : ""}</p>
              <p className="text-[11px] text-primary-foreground/70">Tap to review & approve</p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary-foreground/70" />
          </button>
        </section>
      )}

      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <section className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Active Tasks</h2>
            <button onClick={() => navigate("/requests")} className="text-xs text-primary font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {activeTasks.slice(0, 2).map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      {/* Today's Schedule */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Today's Schedule</h2>
          <button onClick={() => navigate("/calendar")} className="text-xs text-primary font-semibold flex items-center gap-0.5">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {todayJobs.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">No jobs today</p>
            <p className="text-xs text-muted-foreground mt-1">Tap + to create a request</p>
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Upcoming</h2>
            <button onClick={() => navigate("/calendar")} className="text-xs text-primary font-semibold flex items-center gap-0.5">
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Collect Payments</h2>
            <button onClick={() => navigate("/more/finance")} className="text-xs text-primary font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {pendingPayments.slice(0, 3).map(job => (
              <div key={job.id} onClick={() => setSelectedJob(job)} className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-soft active:scale-[0.98] transition-all duration-200 cursor-pointer">
                <div className="h-10 w-10 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
                  <Wallet className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{job.clientName}</p>
                  <p className="text-xs text-muted-foreground font-medium">{job.service}</p>
                </div>
                <p className="text-sm font-bold text-warning shrink-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{(job.amount - job.paidAmount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="h-4" />

      <AddJobSheet open={showAddJob} onOpenChange={setShowAddJob} />
      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default HomePage;
