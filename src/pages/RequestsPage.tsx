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
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Requests & Tasks"
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-4.5 w-4.5 text-primary-foreground" /> }}
      />

      {/* Summary strip */}
      {newRequests.length > 0 && tab !== "new" && (
        <div className="px-4 mt-3">
          <button
            onClick={() => setTab("new")}
            className="w-full bg-accent rounded-xl p-3 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Inbox className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-semibold flex-1 text-left">{newRequests.length} new request{newRequests.length > 1 ? "s" : ""} waiting</p>
            <span className="text-xs text-primary font-semibold">Review</span>
          </button>
        </div>
      )}

      {/* Tab switcher */}
      <div className="px-4 mt-3">
        <div className="flex bg-muted rounded-xl p-1">
          {(["new", "scheduled", "active", "done"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-lg py-2 text-[11px] font-semibold transition-all relative",
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {tabData[t].label}
              {tabData[t].count > 0 && (
                <span className={cn(
                  "ml-1 inline-flex items-center justify-center h-4 min-w-[16px] rounded-full text-[9px] font-bold px-1",
                  t === "new" && tabData[t].count > 0 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
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
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className={cn("font-semibold", tab === "new" && "text-primary")}>Request</span>
          <span>→</span>
          <span className={cn("font-semibold", tab === "scheduled" && "text-primary")}>Approve</span>
          <span>→</span>
          <span className={cn("font-semibold", tab === "active" && "text-primary")}>Execute</span>
          <span>→</span>
          <span className={cn("font-semibold", tab === "done" && "text-primary")}>Complete</span>
        </div>
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-2">
        {displayed.length === 0 ? (
          <div className="text-center py-14">
            <EmptyIcon className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-foreground">{tabData[tab].emptyTitle}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tabData[tab].emptyDesc}</p>
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
