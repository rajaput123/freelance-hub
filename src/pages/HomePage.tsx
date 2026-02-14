import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Briefcase, CalendarPlus, Clock, ChevronRight, Wallet, Users, ClipboardList, Plus, Inbox, Bell, MessageSquare } from "lucide-react";
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
  const unreadMessages = messages.filter(m => !m.read).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning 👋";
    if (h < 17) return "Good Afternoon 👋";
    return "Good Evening 👋";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Dashboard"
        greeting={greeting()}
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-4.5 w-4.5 text-primary-foreground" /> }}
      />

      {/* Stats row */}
      <div className="px-4 -mt-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-card rounded-xl p-2.5 text-center border border-border shadow-sm">
            <p className="text-lg font-bold">{todayJobs.length}</p>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">TODAY</p>
          </div>
          <div className="bg-card rounded-xl p-2.5 text-center border border-border shadow-sm">
            <p className="text-lg font-bold text-primary">{newRequests.length}</p>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">NEW</p>
          </div>
          <div className="bg-card rounded-xl p-2.5 text-center border border-border shadow-sm">
            <p className="text-lg font-bold text-warning">{pendingPayments.length}</p>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">UNPAID</p>
          </div>
          <div className="bg-card rounded-xl p-2.5 text-center border border-border shadow-sm">
            <p className="text-lg font-bold text-success">₹{(totalEarnings / 1000).toFixed(0)}k</p>
            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">EARNED</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-4 gap-3">
          <QuickAction icon={ClipboardList} label="Request" onClick={() => setShowAddJob(true)} color="bg-primary/8 text-primary" />
          <QuickAction icon={Users} label="Clients" onClick={() => navigate("/more/clients")} color="bg-info/8 text-info" />
          <QuickAction icon={CalendarPlus} label="Events" onClick={() => navigate("/more/events")} color="bg-success/8 text-success" />
          <QuickAction icon={Wallet} label="Finance" onClick={() => navigate("/more/finance")} color="bg-warning/8 text-warning" />
        </div>
      </div>

      {/* New requests alert */}
      {newRequests.length > 0 && (
        <section className="px-4 mt-5">
          <button
            onClick={() => navigate("/requests")}
            className="w-full bg-accent rounded-xl p-3 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Inbox className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{newRequests.length} new request{newRequests.length > 1 ? "s" : ""}</p>
              <p className="text-xs text-muted-foreground">Tap to review & approve</p>
            </div>
            <ChevronRight className="h-4 w-4 text-primary" />
          </button>
        </section>
      )}

      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <section className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Active Tasks</h2>
            <button onClick={() => navigate("/requests")} className="text-xs text-primary font-semibold flex items-center">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {activeTasks.slice(0, 2).map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      {/* Today's Schedule */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Today's Schedule</h2>
          <button onClick={() => navigate("/calendar")} className="text-xs text-primary font-semibold flex items-center">
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {todayJobs.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-6 text-center">
            <Clock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No jobs today</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap + to create a request</p>
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
        <section className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Upcoming</h2>
            <button onClick={() => navigate("/calendar")} className="text-xs text-primary font-semibold flex items-center">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {upcomingJobs.map(job => (
              <JobCard key={job.id} job={job} compact onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        </section>
      )}

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <section className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">Collect Payments</h2>
            <button onClick={() => navigate("/more/finance")} className="text-xs text-primary font-semibold flex items-center">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
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
      )}

      <div className="h-4" />

      <AddJobSheet open={showAddJob} onOpenChange={setShowAddJob} />
      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default HomePage;
