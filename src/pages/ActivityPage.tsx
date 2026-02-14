import { useAppData } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { ArrowDownLeft, Briefcase, Calendar, MessageSquare, Banknote, Smartphone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

const methodIcons: Record<string, typeof Banknote> = {
  cash: Banknote,
  upi: Smartphone,
  bank: Building2,
};

const ActivityPage = ({ onMenuClick }: ActivityPageProps) => {
  const { jobs, payments, events } = useAppData();

  // Build activity feed from all data
  const activities: ActivityItem[] = [
    ...jobs.map(j => ({
      id: `job-${j.id}`,
      type: "booking" as const,
      title: `${j.service}`,
      subtitle: `${j.clientName} · ${j.status === "completed" ? "Completed" : j.status === "in_progress" ? "In Progress" : "Scheduled"}`,
      date: j.date,
      amount: j.amount,
      icon: Briefcase,
      color: "bg-primary/8 text-primary",
    })),
    ...payments.map(p => ({
      id: `pay-${p.id}`,
      type: "payment" as const,
      title: `Payment received`,
      subtitle: `${p.clientName} · ${(methodIcons[p.method] ? p.method.toUpperCase() : p.method)} · ${p.type === "partial" ? "Partial" : "Full"}`,
      date: p.date,
      amount: p.amount,
      icon: ArrowDownLeft,
      color: "bg-success/8 text-success",
    })),
    ...events.map(e => ({
      id: `evt-${e.id}`,
      type: "event" as const,
      title: e.title,
      subtitle: `${e.clientName} · ${e.status === "completed" ? "Completed" : e.status === "in_progress" ? "In Progress" : "Planning"}`,
      date: e.date,
      icon: Calendar,
      color: "bg-info/8 text-info",
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Group by date
  const grouped = activities.reduce((acc, item) => {
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Activity" onMenuClick={onMenuClick} />

      <div className="px-4 mt-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No activity yet</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{formatDateLabel(date)}</p>
              <div className="space-y-2">
                {items.map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                      <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", item.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                      </div>
                      {item.amount && (
                        <p className={cn("text-sm font-bold shrink-0", item.type === "payment" ? "text-success" : "text-foreground")}>
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
