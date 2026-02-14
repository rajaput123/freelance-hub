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

  // Generate week days around current date
  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const selectedDateStr = currentDate.toISOString().split("T")[0];
  const dayJobs = jobs.filter(j => j.date === selectedDateStr);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const jobCountForDate = (dateStr: string) => jobs.filter(j => j.date === dateStr).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Calendar"
        onMenuClick={onMenuClick}
        action={{ onClick: () => setShowAddJob(true), icon: <Plus className="h-4.5 w-4.5 text-primary-foreground" /> }}
      />

      {/* Week navigator */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevWeek} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center active:scale-95">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-bold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
          <button onClick={nextWeek} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center active:scale-95">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
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
                  "flex flex-col items-center py-2 rounded-xl transition-all",
                  isSelected ? "bg-primary text-primary-foreground" : "active:bg-muted",
                )}
              >
                <span className={cn("text-[10px] font-medium", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {dayNames[i]}
                </span>
                <span className={cn("text-sm font-bold mt-0.5", isToday && !isSelected && "text-primary")}>
                  {day.getDate()}
                </span>
                {hasJobs && (
                  <div className={cn("h-1 w-1 rounded-full mt-0.5", isSelected ? "bg-primary-foreground" : "bg-primary")} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day's jobs */}
      <div className="px-4 mt-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3">
          {selectedDateStr === todayStr ? "Today" : currentDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })} · {dayJobs.length} job{dayJobs.length !== 1 ? "s" : ""}
        </p>

        {dayJobs.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-8 text-center">
            <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">No jobs scheduled</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap + to add a new job</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </div>

      <AddJobSheet open={showAddJob} onOpenChange={setShowAddJob} />
      <JobDetailSheet job={selectedJob} open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)} />
    </div>
  );
};

export default CalendarPage;
