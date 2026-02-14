import { useState } from "react";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import AddJobSheet from "@/components/AddJobSheet";
import { Search, SlidersHorizontal } from "lucide-react";
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
  const [search, setSearch] = useState("");

  const filtered = jobs
    .filter(j => filter === "all" || j.status === filter)
    .filter(j => !search || j.clientName.toLowerCase().includes(search.toLowerCase()) || j.service.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-11 pb-3">
        <h1 className="text-xl font-bold mb-3">Jobs</h1>
        
        {/* Search bar - Swiggy style */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-background rounded-xl px-3 h-10 border border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search jobs or clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-all border",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-semibold text-[14px]">No jobs found</p>
            <p className="text-[12px] mt-1">Try adjusting your filters</p>
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
