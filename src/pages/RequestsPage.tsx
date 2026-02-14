import { useAppData } from "@/context/AppContext";
import { useState } from "react";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import PageHeader from "@/components/PageHeader";
import AddJobSheet from "@/components/AddJobSheet";
import { cn } from "@/lib/utils";
import { ClipboardList, Plus, Inbox, Clock, Zap, CheckCircle2 } from "lucide-react";

interface RequestsPageProps {
  onMenuClick: () => void;
}

const RequestsPage = ({ onMenuClick }: RequestsPageProps) => {
  const { jobs } = useAppData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [tab, setTab] = useState<"new" | "scheduled" | "active" | "done">("new");

  const newRequests = jobs.filter(j => j.status === "pending");
  const scheduled = jobs.filter(j => j.status === "scheduled");
  const active = jobs.filter(j => j.status === "in_progress");
  const done = jobs.filter(j => j.status === "completed");

  const tabData = {
    new: { items: newRequests, label: "New", count: newRequests.length, icon: Inbox, emptyTitle: "No new requests", emptyDesc: "Create a request with the + button" },
    scheduled: { items: scheduled, label: "Approved", count: scheduled.length, icon: Clock, emptyTitle: "No scheduled tasks", emptyDesc: "Approve new requests to schedule them" },
    active: { items: active, label: "Active", count: active.length, icon: Zap, emptyTitle: "No active tasks", emptyDesc: "Start a scheduled task to begin" },
    done: { items: done, label: "Done", count: done.length, icon: CheckCircle2, emptyTitle: "No completed tasks", emptyDesc: "Complete tasks to see them here" },
  };

  const displayed = tabData[tab].items;
  const EmptyIcon = tabData[tab].icon;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Requests & Tasks"
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-[18px] w-[18px] text-primary-foreground" /> }}
      />

      {/* Summary strip */}
      {newRequests.length > 0 && tab !== "new" && (
        <div className="px-4 -mt-3">
          <button
            onClick={() => setTab("new")}
            className="w-full gradient-primary rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-all shadow-glow"
          >
            <div className="h-9 w-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Inbox className="h-4 w-4 text-primary-foreground" />
            </div>
            <p className="text-sm font-bold flex-1 text-left text-primary-foreground">{newRequests.length} new request{newRequests.length > 1 ? "s" : ""} waiting</p>
            <span className="text-xs text-primary-foreground/80 font-semibold">Review →</span>
          </button>
        </div>
      )}

      {/* Tab switcher */}
      <div className={cn("px-4", newRequests.length > 0 && tab !== "new" ? "mt-3" : "-mt-3")}>
        <div className="flex bg-card rounded-2xl p-1 shadow-soft">
          {(["new", "scheduled", "active", "done"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-[11px] font-bold transition-all relative",
                tab === t ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              )}
            >
              {tabData[t].label}
              {tabData[t].count > 0 && (
                <span className={cn(
                  "ml-1 inline-flex items-center justify-center h-4 min-w-[16px] rounded-full text-[9px] font-bold px-1",
                  tab === t ? "bg-primary-foreground/25 text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {tabData[t].count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lifecycle indicator */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          {["Request", "Approve", "Execute", "Complete"].map((step, i) => (
            <span key={step} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border">→</span>}
              <span className={cn(
                "font-bold",
                (i === 0 && tab === "new") || (i === 1 && tab === "scheduled") || (i === 2 && tab === "active") || (i === 3 && tab === "done")
                  ? "text-primary" : ""
              )}>{step}</span>
            </span>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-2.5">
        {displayed.length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <EmptyIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">{tabData[tab].emptyTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">{tabData[tab].emptyDesc}</p>
          </div>
        ) : (
          displayed.map(job => (
            <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
          ))
        )}
      </div>

      <AddJobSheet open={showAddJob} onOpenChange={setShowAddJob} />
      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default RequestsPage;
