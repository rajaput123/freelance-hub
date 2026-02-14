import { useAppData } from "@/context/AppContext";
import AddClientSheet from "@/components/AddClientSheet";
import { Search, Phone, MapPin, Briefcase, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ClientsPage = () => {
  const { clients, jobs } = useAppData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Clients</h1>
        </div>
        <div className="flex items-center gap-2 bg-card rounded-xl px-3.5 h-11 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium"
          />
        </div>
      </div>

      <div className="px-4 mt-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{filtered.length} clients</p>
        <div className="space-y-2.5">
          {filtered.map(client => {
            const clientJobs = jobs.filter(j => j.clientId === client.id);
            return (
              <div key={client.id} className="bg-card rounded-2xl p-3.5 shadow-soft active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-glow/50">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{client.name}</p>
                    {client.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                        <Phone className="h-3 w-3" /> {client.phone}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>

                {client.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2.5 ml-[56px]">
                    <MapPin className="h-3 w-3" /> {client.location}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs mt-2.5 pt-2.5 border-t border-border ml-[56px]">
                  <span className="text-muted-foreground flex items-center gap-1 font-medium">
                    <Briefcase className="h-3 w-3" /> {clientJobs.length} jobs
                  </span>
                  <span className="font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{client.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
