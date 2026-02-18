import { useAppData } from "@/context/AppContext";
import { useState } from "react";
import { Job } from "@/data/types";
import RequestCard from "@/components/RequestCard";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import JobExecutionSheet from "@/components/JobExecutionSheet";
import RequestActionSheet from "@/components/RequestActionSheet";
import RescheduleSheet from "@/components/RescheduleSheet";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/utils";
import { ClipboardList, Inbox, Clock, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RequestsPageProps {
  onMenuClick: () => void;
}

const RequestsPage = ({ onMenuClick }: RequestsPageProps) => {
  const { jobs, updateJobStatus } = useAppData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Job | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [tab, setTab] = useState<"incoming" | "scheduled" | "active" | "completed">("incoming");

  const incomingRequests = jobs.filter(j => j.status === "pending");
  const scheduled = jobs.filter(j => j.status === "scheduled");
  const active = jobs.filter(j => j.status === "in_progress");
  const completed = jobs.filter(j => j.status === "completed");

  const tabData = {
    incoming: { 
      items: incomingRequests, 
      label: "Incoming", 
      count: incomingRequests.length, 
      icon: Inbox, 
      emptyTitle: "No new requests", 
      emptyDesc: "New service requests will appear here" 
    },
    scheduled: { 
      items: scheduled, 
      label: "Scheduled", 
      count: scheduled.length, 
      icon: Clock, 
      emptyTitle: "No scheduled bookings", 
      emptyDesc: "Accepted requests will appear here" 
    },
    active: { 
      items: active, 
      label: "Active", 
      count: active.length, 
      icon: Zap, 
      emptyTitle: "No active jobs", 
      emptyDesc: "Jobs in progress will appear here" 
    },
    completed: { 
      items: completed, 
      label: "Completed", 
      count: completed.length, 
      icon: CheckCircle2, 
      emptyTitle: "No completed jobs", 
      emptyDesc: "Completed jobs will appear here" 
    },
  };

  const displayed = tabData[tab].items;
  const EmptyIcon = tabData[tab].icon;

  const handleAccept = (request: Job) => {
    setSelectedRequest(request);
    setShowReschedule(false); // Ensure reschedule sheet is closed
  };

  const handleRequestAccepted = (jobId: string) => {
    // Use setTimeout to defer state updates and avoid hooks order issues
    setTimeout(() => {
      // Switch to Scheduled tab
      setTab("scheduled");
      
      // Find and select the accepted job
      const acceptedJob = jobs.find(j => j.id === jobId);
      if (acceptedJob) {
        setSelectedJob(acceptedJob);
        // Automatically open JobDetailSheet after a short delay to show next steps
        setTimeout(() => {
          // JobDetailSheet will open automatically because selectedJob is set
          // This gives time for the tab switch animation to complete
        }, 300);
      }
    }, 100);
  };

  const handleReschedule = (request: Job) => {
    setSelectedRequest(request);
    setShowReschedule(true);
  };

  const handleDecline = (request: Job) => {
    setSelectedRequest(request);
    setShowReschedule(false); // Ensure reschedule sheet is closed
  };

  const handleStartJob = (job: Job) => {
    updateJobStatus(job.id, "in_progress");
    toast.success("Job started! You can now track progress and add expenses.");
    setTab("active");
  };

  const handleCompleteJob = (job: Job) => {
    // Open JobExecutionSheet to add review, photos, etc. before completing
    setSelectedJob(job);
    setShowExecution(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Requests & Bookings"
        onMenuClick={onMenuClick}
      />

      {/* New Requests Alert */}
      {incomingRequests.length > 0 && tab !== "incoming" && (
        <div className="px-4 -mt-3">
          <button
            onClick={() => setTab("incoming")}
            className="w-full gradient-primary rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] transition-all shadow-glow"
          >
            <div className="h-9 w-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Inbox className="h-4 w-4 text-primary-foreground" />
            </div>
            <p className="text-sm font-bold flex-1 text-left text-primary-foreground">
              {incomingRequests.length} new request{incomingRequests.length > 1 ? "s" : ""} waiting
            </p>
            <span className="text-xs text-primary-foreground/80 font-semibold">Review →</span>
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className={cn("px-4", incomingRequests.length > 0 && tab !== "incoming" ? "mt-3" : "-mt-3")}>
        <div className="flex bg-card rounded-2xl p-1 shadow-soft">
          {(["incoming", "scheduled", "active", "completed"] as const).map(t => (
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

      {/* Workflow Indicator */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          {["Request", "Accept", "Execute", "Complete"].map((step, i) => (
            <span key={step} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border">→</span>}
              <span className={cn(
                "font-bold",
                (i === 0 && tab === "incoming") || (i === 1 && tab === "scheduled") || (i === 2 && tab === "active") || (i === 3 && tab === "completed")
                  ? "text-primary" : ""
              )}>{step}</span>
            </span>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-3">
        {displayed.length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <EmptyIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">{tabData[tab].emptyTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">{tabData[tab].emptyDesc}</p>
          </div>
        ) : (
          displayed.map(job => {
            if (tab === "incoming") {
              return (
                <RequestCard
                  key={job.id}
                  request={job}
                  onClick={() => setSelectedRequest(job)}
                  onAccept={() => handleAccept(job)}
                  onReschedule={() => handleReschedule(job)}
                  onDecline={() => handleDecline(job)}
                />
              );
            } else {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() => {
                    setSelectedJob(job);
                    if (job.status === "in_progress") {
                      setShowExecution(true);
                    }
                  }}
                  onStartJob={job.status === "scheduled" ? () => handleStartJob(job) : undefined}
                  onComplete={job.status === "in_progress" ? () => handleCompleteJob(job) : undefined}
                />
              );
            }
          })
        )}
      </div>

      {/* Sheets */}
      <RequestActionSheet
        request={selectedRequest}
        open={!!selectedRequest && !showReschedule}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
        onReschedule={() => {
          setShowReschedule(true);
        }}
        onAccepted={handleRequestAccepted}
      />

      <RescheduleSheet
        request={selectedRequest}
        open={showReschedule}
        onOpenChange={(open) => {
          setShowReschedule(open);
          if (!open) setSelectedRequest(null);
        }}
      />

      <JobDetailSheet
        job={selectedJob}
        open={!!selectedJob && !showExecution && selectedJob?.status !== "in_progress"}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
      />

      <JobExecutionSheet
        job={selectedJob}
        open={showExecution}
        onOpenChange={(open) => {
          setShowExecution(open);
          if (!open && selectedJob?.status === "completed") {
            // Job was completed, switch to completed tab
            setTab("completed");
            setTimeout(() => {
              setSelectedJob(null);
            }, 300);
          } else if (!open) {
            setSelectedJob(null);
          }
        }}
      />
    </div>
  );
};

export default RequestsPage;
