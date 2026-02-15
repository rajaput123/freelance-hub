import { useAppData } from "@/context/AppContext";
import { useState, useMemo } from "react";
import { Job, FreelancerEvent } from "@/data/types";
import JobDetailSheet from "@/components/JobDetailSheet";
import JobExecutionSheet from "@/components/JobExecutionSheet";
import RescheduleSheet from "@/components/RescheduleSheet";
import PageHeader from "@/components/PageHeader";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CalendarPageProps {
  onMenuClick: () => void;
}

type ViewMode = "day" | "week" | "month";

const CalendarPage = ({ onMenuClick }: CalendarPageProps) => {
  const { jobs, events } = useAppData();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showExecution, setShowExecution] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Filter calendar items
  const calendarJobs = jobs.filter(j => j.status !== "pending" && j.status !== "cancelled");
  const calendarEvents = events.filter(e => e.status !== "completed");

  // Get all calendar items for a date
  const getItemsForDate = (dateStr: string) => {
    const dayJobs = calendarJobs.filter(j => j.date === dateStr);
    const dayEvents = calendarEvents.filter(e => {
      const eventStart = new Date(e.date);
      const eventEnd = new Date(e.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
    return { jobs: dayJobs, events: dayEvents };
  };

  // Check for conflicts (overlapping bookings)
  const checkConflicts = (dateStr: string, timeStr: string, excludeJobId?: string) => {
    const items = getItemsForDate(dateStr);
    const [hour, minute] = timeStr.split(":").map(Number);
    const checkTime = hour * 60 + minute;

    return items.jobs
      .filter(j => j.id !== excludeJobId)
      .some(job => {
        const [jobHour, jobMinute] = job.time.split(":").map(Number);
        const jobTime = jobHour * 60 + jobMinute;
        // Check if times overlap (assuming 1 hour duration for simplicity)
        return Math.abs(checkTime - jobTime) < 60;
      });
  };

  // Get conflicting jobs for a specific job
  const getConflictingJobs = (job: Job) => {
    const items = getItemsForDate(job.date);
    const [hour, minute] = job.time.split(":").map(Number);
    const jobTime = hour * 60 + minute;

    return items.jobs.filter(j => {
      if (j.id === job.id) return false;
      const [jHour, jMinute] = j.time.split(":").map(Number);
      const jTime = jHour * 60 + jMinute;
      return Math.abs(jobTime - jTime) < 60;
    });
  };

  // Get week days
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

  // Get month days
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41); // 6 weeks

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  // Navigation
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get status color
  const getStatusColor = (status: string, type: "job" | "event" = "job") => {
    if (type === "event") {
      return {
        planning: "bg-info/20 border-info/50 text-info",
        in_progress: "bg-primary/20 border-primary/50 text-primary",
        completed: "bg-success/20 border-success/50 text-success",
      }[status as "planning" | "in_progress" | "completed"] || "bg-muted";
    }
    return {
      scheduled: "bg-primary/20 border-primary/50 text-primary",
      in_progress: "bg-warning/20 border-warning/50 text-warning",
      completed: "bg-success/20 border-success/50 text-success",
      cancelled: "bg-destructive/20 border-destructive/50 text-destructive",
    }[status as string] || "bg-muted";
  };

  const weekDays = viewMode === "week" ? getWeekDays() : [];
  const monthDays = viewMode === "month" ? getMonthDays() : [];
  const selectedDateStr = currentDate.toISOString().split("T")[0];
  const selectedItems = getItemsForDate(selectedDateStr);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Calendar"
        onMenuClick={onMenuClick}
      />

      {/* View Mode Selector */}
      <div className="px-4 -mt-3">
        <div className="flex bg-card rounded-2xl p-1 shadow-soft">
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-bold transition-all capitalize",
                viewMode === mode ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl shadow-lg border border-border/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateDate("prev")}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {viewMode === "month"
                  ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : viewMode === "week"
                  ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : currentDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <button
                onClick={goToToday}
                className="text-xs font-semibold text-primary px-2 py-1 rounded-lg bg-primary/10 active:scale-95"
              >
                Today
              </button>
            </div>
            <button
              onClick={() => navigateDate("next")}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day View */}
          {viewMode === "day" && (
            <div className="space-y-2">
              {/* Time slots */}
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, "0");
                const time = `${hour}:00`;
                const itemsAtTime = selectedItems.jobs.filter(j => j.time.startsWith(hour));
                const hasConflict = itemsAtTime.length > 1;

                return (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 text-xs text-muted-foreground font-semibold pt-1">{time}</div>
                    <div className="flex-1 min-h-[60px] border-t border-border/30 relative">
                      {itemsAtTime.map((job) => {
                        const hasConflictForThis = hasConflict;
                        return (
                          <div
                            key={job.id}
                            onClick={() => {
                              setSelectedJob(job);
                              if (job.status === "in_progress") {
                                setShowExecution(true);
                              }
                            }}
                            className={cn(
                              "absolute left-0 right-0 top-0 rounded-lg p-2 mb-1 border-l-4 cursor-pointer active:scale-[0.98] transition-all",
                              getStatusColor(job.status, "job"),
                              hasConflictForThis && "border-destructive/50"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{job.clientName}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{job.service}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="text-[10px]">{job.location}</span>
                                </div>
                              </div>
                              {hasConflictForThis && (
                                <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {selectedItems.events.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => navigate(`/event/${event.id}`)}
                          className={cn(
                            "absolute left-0 right-0 top-0 rounded-lg p-2 mb-1 border-l-4 cursor-pointer active:scale-[0.98] transition-all",
                            getStatusColor(event.status, "event")
                          )}
                        >
                          <p className="text-xs font-bold truncate">{event.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{event.clientName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Week View */}
          {viewMode === "week" && (
            <div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, i) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDateStr;
                  const items = getItemsForDate(dateStr);
                  const hasConflict = items.jobs.some(job => checkConflicts(dateStr, job.time, job.id));

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentDate(new Date(day))}
                      className={cn(
                        "flex flex-col items-center py-2 rounded-xl transition-all min-h-[80px]",
                        isSelected ? "gradient-primary shadow-glow text-primary-foreground" : "active:bg-muted",
                        isToday && !isSelected && "ring-2 ring-primary"
                      )}
                    >
                      <span className={cn("text-sm font-bold", isToday && !isSelected && "text-primary")}>
                        {day.getDate()}
                      </span>
                      <div className="flex-1 w-full mt-1 space-y-0.5">
                        {items.jobs.slice(0, 2).map((job) => (
                          <div
                            key={job.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                              if (job.status === "in_progress") {
                                setShowExecution(true);
                              }
                            }}
                            className={cn(
                              "text-[9px] px-1 py-0.5 rounded truncate border-l-2",
                              getStatusColor(job.status, "job")
                            )}
                          >
                            {job.time} {job.clientName}
                          </div>
                        ))}
                        {items.events.map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/event/${event.id}`);
                            }}
                            className={cn(
                              "text-[9px] px-1 py-0.5 rounded truncate border-l-2",
                              getStatusColor(event.status, "event")
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {items.jobs.length + items.events.length > 2 && (
                          <div className="text-[9px] text-muted-foreground">
                            +{items.jobs.length + items.events.length - 2} more
                          </div>
                        )}
                      </div>
                      {hasConflict && (
                        <AlertTriangle className="h-3 w-3 text-destructive absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Month View */}
          {viewMode === "month" && (
            <div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, i) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const isToday = dateStr === todayStr;
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const items = getItemsForDate(dateStr);
                  const totalItems = items.jobs.length + items.events.length;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentDate(new Date(day));
                        setViewMode("day");
                      }}
                      className={cn(
                        "flex flex-col items-center py-1.5 rounded-xl transition-all min-h-[60px] relative",
                        !isCurrentMonth && "opacity-30",
                        isToday && "ring-2 ring-primary",
                        totalItems > 0 && "bg-muted/30"
                      )}
                    >
                      <span className={cn("text-xs font-bold", isToday && "text-primary")}>
                        {day.getDate()}
                      </span>
                      {totalItems > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {items.jobs.slice(0, 3).map((job, idx) => (
                            <div
                              key={job.id}
                              className={cn("h-1.5 w-1.5 rounded-full", getStatusColor(job.status, "job").split(" ")[0])}
                            />
                          ))}
                          {items.events.slice(0, 3 - items.jobs.length).map((event, idx) => (
                            <div
                              key={event.id}
                              className={cn("h-1.5 w-1.5 rounded-full", getStatusColor(event.status, "event").split(" ")[0])}
                            />
                          ))}
                        </div>
                      )}
                      {totalItems > 3 && (
                        <span className="text-[9px] text-muted-foreground mt-0.5">+{totalItems - 3}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Day Items */}
      {viewMode !== "month" && (
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">
              {selectedDateStr === todayStr ? "Today" : currentDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </p>
            <span className="text-xs text-muted-foreground">
              {selectedItems.jobs.length + selectedItems.events.length} item{selectedItems.jobs.length + selectedItems.events.length !== 1 ? "s" : ""}
            </span>
          </div>

          {selectedItems.jobs.length === 0 && selectedItems.events.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
              <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-foreground">No bookings</p>
              <p className="text-xs text-muted-foreground mt-1">This day is free</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Jobs */}
              {selectedItems.jobs.map((job) => {
                const hasConflict = checkConflicts(job.date, job.time, job.id);
                const conflictingJobs = hasConflict ? getConflictingJobs(job) : [];
                return (
                  <div key={job.id}>
                    <div
                      onClick={() => {
                        setSelectedJob(job);
                        if (job.status === "in_progress") {
                          setShowExecution(true);
                        }
                      }}
                      className={cn(
                        "bg-white rounded-2xl p-4 shadow-lg border-l-4 cursor-pointer active:scale-[0.98] transition-all",
                        getStatusColor(job.status, "job"),
                        hasConflict && "border-destructive/50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold truncate">{job.clientName}</p>
                            {hasConflict && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{job.service}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" /> {job.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {job.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            ₹{job.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {hasConflict && conflictingJobs.length > 0 && (
                      <div className="mt-2 bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-destructive mb-1">Schedule Conflict</p>
                            <p className="text-[10px] text-muted-foreground">
                              Overlaps with: {conflictingJobs.map(j => `${j.clientName} (${j.time})`).join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Events */}
              {selectedItems.events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className={cn(
                    "bg-white rounded-2xl p-4 shadow-lg border-l-4 cursor-pointer active:scale-[0.98] transition-all",
                    getStatusColor(event.status, "event")
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{event.clientName}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {event.date === event.endDate ? event.date : `${event.date} - ${event.endDate}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        ₹{event.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sheets */}
      <JobDetailSheet
        job={selectedJob}
        open={!!selectedJob && !showReschedule && !showExecution && selectedJob?.status !== "in_progress"}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null);
        }}
      />

      <RescheduleSheet
        request={selectedJob}
        open={showReschedule}
        onOpenChange={(open) => {
          setShowReschedule(open);
          if (!open) setSelectedJob(null);
        }}
      />

      <JobExecutionSheet
        job={selectedJob}
        open={showExecution}
        onOpenChange={(open) => {
          setShowExecution(open);
          if (!open) setSelectedJob(null);
        }}
      />
    </div>
  );
};

export default CalendarPage;
