import { useAppData } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { ArrowDownLeft, Briefcase, Calendar, MessageSquare, Bell, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ActivityPageProps {
  onMenuClick: () => void;
}

type ActivityItem = {
  id: string;
  type: "booking" | "payment" | "event" | "communication";
  title: string;
  subtitle: string;
  date: string;
  amount?: number;
  icon: typeof Briefcase;
  color: string;
};

const ActivityPage = ({ onMenuClick }: ActivityPageProps) => {
  const { jobs, payments, events, messages } = useAppData();
  const [filter, setFilter] = useState<"all" | "bookings" | "payments" | "events" | "messages">("all");

  const activities: ActivityItem[] = [
    ...jobs.map(j => ({
      id: `job-${j.id}`,
      type: "booking" as const,
      title: j.service,
      subtitle: `${j.clientName} · ${j.status === "pending" ? "New Request" : j.status === "completed" ? "Completed" : j.status === "in_progress" ? "In Progress" : j.status === "cancelled" ? "Cancelled" : "Scheduled"}`,
      date: j.date,
      amount: j.amount,
      icon: j.status === "pending" ? Bell : j.convertedToEventId ? ArrowUpRight : Briefcase,
      color: j.status === "pending" ? "bg-accent text-accent-foreground" : j.convertedToEventId ? "bg-info/10 text-info" : "bg-primary/10 text-primary",
    })),
    ...payments.map(p => ({
      id: `pay-${p.id}`,
      type: "payment" as const,
      title: "Payment received",
      subtitle: `${p.clientName} · ${p.method.toUpperCase()} · ${p.type === "partial" ? "Partial" : "Full"}`,
      date: p.date,
      amount: p.amount,
      icon: ArrowDownLeft,
      color: "bg-success/10 text-success",
    })),
    ...events.map(e => ({
      id: `evt-${e.id}`,
      type: "event" as const,
      title: e.title,
      subtitle: `${e.clientName} · ${e.status === "completed" ? "Completed" : e.status === "in_progress" ? "In Progress" : "Planning"}`,
      date: e.date,
      icon: Calendar,
      color: "bg-info/10 text-info",
    })),
    ...messages.map(m => ({
      id: `msg-${m.id}`,
      type: "communication" as const,
      title: m.title,
      subtitle: `To: ${m.recipientName} · ${m.type}`,
      date: m.date,
      icon: MessageSquare,
      color: m.read ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive",
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const filtered = filter === "all" ? activities
    : filter === "bookings" ? activities.filter(a => a.type === "booking")
    : filter === "payments" ? activities.filter(a => a.type === "payment")
    : filter === "events" ? activities.filter(a => a.type === "event")
    : activities.filter(a => a.type === "communication");

  const grouped = filtered.reduce((acc, item) => {
    const key = item.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  const today = new Date().toISOString().split("T")[0];

  const formatDateLabel = (dateStr: string) => {
    if (dateStr === today) return "Today";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "bookings", label: "Bookings" },
    { key: "payments", label: "Payments" },
    { key: "events", label: "Events" },
    { key: "messages", label: "Messages" },
  ] as const;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Activity" onMenuClick={onMenuClick} />

      {/* Filters */}
      <div className="px-4 -mt-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 whitespace-nowrap",
                filter === f.key ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card text-muted-foreground shadow-soft"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold">No activity yet</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{formatDateLabel(date)}</p>
              <div className="space-y-2">
                {items.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-soft">
                      <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0", item.color)}>
                        <Icon className="h-[18px] w-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{item.subtitle}</p>
                      </div>
                      {item.amount !== undefined && (
                        <p className={cn("text-sm font-bold shrink-0", item.type === "payment" ? "text-success" : "text-foreground")} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {item.type === "payment" ? "+" : ""}₹{item.amount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
