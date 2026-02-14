import { useState } from "react";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import AddJobSheet from "@/components/AddJobSheet";
import { Plus, Filter } from "lucide-react";
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
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <AddJobSheet
            trigger={
              <Button size="icon" className="rounded-xl h-10 w-10">
                <Plus className="h-5 w-5" />
              </Button>
            }
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No jobs found</p>
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
