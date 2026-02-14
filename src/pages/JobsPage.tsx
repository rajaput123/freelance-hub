import { useState } from "react";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const statusFilters = ["all", "scheduled", "in_progress", "completed"] as const;
const filterLabels: Record<string, string> = { all: "All", scheduled: "Scheduled", in_progress: "Active", completed: "Done" };

const JobsPage = () => {
  const navigate = useNavigate();
  const { jobs } = useAppData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = jobs
    .filter(j => filter === "all" || j.status === filter)
    .filter(j => !search || j.clientName.toLowerCase().includes(search.toLowerCase()) || j.service.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Jobs</h1>
        </div>

        <div className="flex items-center gap-2 bg-card rounded-xl px-3.5 h-11 shadow-soft mb-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search jobs or clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200",
                filter === f ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card text-muted-foreground shadow-soft"
              )}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
            <p className="text-sm font-bold">No jobs found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
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
