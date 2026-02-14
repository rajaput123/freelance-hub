import { useAppData } from "@/context/AppContext";
import AddClientSheet from "@/components/AddClientSheet";
import { Search, Phone, MapPin, Briefcase, ChevronRight } from "lucide-react";
import { useState } from "react";

const ClientsPage = () => {
  const { clients, jobs } = useAppData();
  const [search, setSearch] = useState("");

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-11 pb-3">
        <h1 className="text-xl font-bold mb-3">Clients</h1>
        <div className="flex items-center gap-2 bg-background rounded-xl px-3 h-10 border border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-4 mt-3">
        <p className="text-[12px] text-muted-foreground font-medium px-1 mb-2">{filtered.length} clients</p>
        <div className="space-y-2">
          {filtered.map(client => {
            const clientJobs = jobs.filter(j => j.clientId === client.id);
            const totalSpent = clientJobs.reduce((s, j) => s + j.paidAmount, 0);
            return (
              <div key={client.id} className="rounded-2xl bg-card border border-border/50 p-4 shadow-sm active:scale-[0.98] transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[16px] shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] truncate">{client.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {client.phone && (
                        <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {client.phone}
                        </p>
                      )}
                      {client.location && (
                        <p className="text-[12px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {client.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>

                <div className="mt-3 flex items-center justify-between text-[12px] pt-2.5 border-t border-border/40">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="h-3 w-3" /> {clientJobs.length} jobs
                  </span>
                  <span className="font-bold text-[13px]">₹{(client.totalSpent || totalSpent).toLocaleString()} earned</span>
                </div>

                {client.notes && (
                  <p className="mt-2 text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-1.5">{client.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
