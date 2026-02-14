import { useNavigate } from "react-router-dom";
import { ArrowLeft, Megaphone } from "lucide-react";

const AnnouncementsPage = () => {
  const navigate = useNavigate();

  const announcements = [
    { id: 1, title: "Peak season pricing update", desc: "Wedding season rates effective from March 1st", date: "2026-02-12", type: "info" },
    { id: 2, title: "New service added", desc: "Photography service now available in catalog", date: "2026-02-10", type: "success" },
    { id: 3, title: "Payment reminder sent", desc: "Auto-reminders sent to 2 clients", date: "2026-02-08", type: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">Announcements</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {announcements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-full bg-destructive/8 flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{a.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
