import { useState } from "react";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import AddJobSheet from "@/components/AddJobSheet";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "scheduled", "in_progress", "completed"] as const;
const filterLabels: Record<string, string> = {
  all: "All",
  scheduled: "Scheduled",
  in_progress: "Active",
  completed: "Done",
};

const JobsPage = () => {
  const { jobs } = useAppData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-10 glass border-b border-border/50 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <AddJobSheet
            trigger={
              <Button size="icon" className="rounded-xl h-10 w-10 gradient-primary shadow-elevated border-0">
                <Plus className="h-5 w-5" />
              </Button>
            }
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 border",
                filter === f
                  ? "gradient-primary text-primary-foreground border-transparent shadow-card"
                  : "bg-card text-muted-foreground border-border/60 hover:text-foreground"
              )}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Plus className="h-6 w-6" />
            </div>
            <p className="font-medium">No jobs found</p>
            <p className="text-sm mt-1">Create your first job to get started</p>
          </div>
        ) : (
          filtered.map(job => (
            <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
          ))
        )}
      </div>

      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default JobsPage;
