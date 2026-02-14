import { useAppData } from "@/context/AppContext";
import { useState } from "react";
import { Job } from "@/data/types";
import JobCard from "@/components/JobCard";
import JobDetailSheet from "@/components/JobDetailSheet";
import PageHeader from "@/components/PageHeader";
import AddJobSheet from "@/components/AddJobSheet";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPageProps {
  onMenuClick: () => void;
}

const CalendarPage = ({ onMenuClick }: CalendarPageProps) => {
  const { jobs } = useAppData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddJob, setShowAddJob] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const calendarJobs = jobs.filter(j => j.status !== "pending" && j.status !== "cancelled");

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const selectedDateStr = currentDate.toISOString().split("T")[0];
  const dayJobs = calendarJobs.filter(j => j.date === selectedDateStr);

  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
  const jobCountForDate = (dateStr: string) => calendarJobs.filter(j => j.date === dateStr).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Calendar"
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-[18px] w-[18px] text-primary-foreground" /> }}
      />

      {/* Week navigator */}
      <div className="px-4 -mt-3">
        <div className="bg-card rounded-2xl shadow-soft p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevWeek} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
            <button onClick={nextWeek} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((day, i) => {
              const dateStr = day.toISOString().split("T")[0];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;
              const hasJobs = jobCountForDate(dateStr) > 0;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentDate(new Date(day))}
                  className={cn(
                    "flex flex-col items-center py-2.5 rounded-2xl transition-all duration-200",
                    isSelected ? "gradient-primary shadow-glow text-primary-foreground" : "active:bg-muted",
                  )}
                >
                  <span className={cn("text-[10px] font-semibold", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {dayNames[i]}
                  </span>
                  <span className={cn("text-sm font-bold mt-1", isToday && !isSelected && "text-primary")}>
                    {day.getDate()}
                  </span>
                  {hasJobs && (
                    <div className={cn("h-1.5 w-1.5 rounded-full mt-1", isSelected ? "bg-primary-foreground" : "bg-primary")} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day's jobs */}
      <div className="px-4 mt-5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
          {selectedDateStr === todayStr ? "Today" : currentDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })} · {dayJobs.length} booking{dayJobs.length !== 1 ? "s" : ""}
        </p>

        {dayJobs.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">No bookings</p>
            <p className="text-xs text-muted-foreground mt-1">Approve requests to see them here</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dayJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </div>

      <AddJobSheet open={showAddJob} onOpenChange={setShowAddJob} initialStatus="scheduled" />
      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default CalendarPage;
