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
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">Clients</h1>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 h-9">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-4 mt-3">
        <p className="text-xs text-muted-foreground mb-2">{filtered.length} clients</p>
        <div className="space-y-2">
          {filtered.map(client => {
            const clientJobs = jobs.filter(j => j.clientId === client.id);
            return (
              <div key={client.id} className="bg-card border border-border rounded-xl p-3 active:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/8 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{client.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {client.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {client.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>

                {client.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 ml-[52px]">
                    <MapPin className="h-3 w-3" /> {client.location}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border ml-[52px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {clientJobs.length} jobs
                  </span>
                  <span className="font-semibold text-sm">₹{client.totalSpent.toLocaleString()}</span>
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
