import { useAppData } from "@/context/AppContext";
import { useState } from "react";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import PageHeader from "@/components/PageHeader";
import AddJobSheet from "@/components/AddJobSheet";
import { cn } from "@/lib/utils";
import { ClipboardList, Plus } from "lucide-react";

interface RequestsPageProps {
  onMenuClick: () => void;
}

const RequestsPage = ({ onMenuClick }: RequestsPageProps) => {
  const { jobs } = useAppData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [tab, setTab] = useState<"pending" | "active" | "done">("pending");

  const pending = jobs.filter(j => j.status === "scheduled");
  const active = jobs.filter(j => j.status === "in_progress");
  const done = jobs.filter(j => j.status === "completed");

  const tabData = {
    pending: { items: pending, label: "Pending", count: pending.length },
    active: { items: active, label: "Active", count: active.length },
    done: { items: done, label: "Done", count: done.length },
  };

  const displayed = tabData[tab].items;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Requests & Tasks"
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-4.5 w-4.5 text-primary-foreground" /> }}
      />

      {/* Tab switcher */}
      <div className="px-4 mt-4">
        <div className="flex bg-muted rounded-xl p-1">
          {(["pending", "active", "done"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-all",
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {tabData[t].label} ({tabData[t].count})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 mt-4 space-y-2">
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-foreground">No {tabData[tab].label.toLowerCase()} tasks</p>
            <p className="text-xs text-muted-foreground mt-0.5">All caught up!</p>
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
