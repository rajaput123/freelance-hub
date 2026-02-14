import { useAppData } from "@/context/AppContext";
import AddClientSheet from "@/components/AddClientSheet";
import { Plus, Phone, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientsPage = () => {
  const { clients, jobs } = useAppData();

  return (
    <div className="min-h-screen pb-28">
      <div className="sticky top-0 z-10 glass border-b border-border/50 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <AddClientSheet
            trigger={
              <Button size="icon" className="rounded-xl h-10 w-10 gradient-primary shadow-elevated border-0">
                <Plus className="h-5 w-5" />
              </Button>
            }
          />
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {clients.map(client => {
          const clientJobs = jobs.filter(j => j.clientId === client.id);
          const lastJob = clientJobs[0];
          return (
            <div key={client.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-card hover:shadow-elevated transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-primary-foreground font-bold text-lg shadow-card">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{client.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Phone className="h-3 w-3" /> {client.phone || "No phone"}
                    </p>
                  </div>
                </div>
              </div>

              {client.location && (
                <p className="text-sm text-muted-foreground mt-2.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {client.location}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-sm pt-2.5 border-t border-border/40">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" /> {clientJobs.length} jobs
                </span>
                <span className="font-bold">₹{client.totalSpent.toLocaleString()}</span>
              </div>

              {lastJob && (
                <div className="mt-2.5 rounded-xl bg-accent/50 px-3 py-2 text-xs text-accent-foreground font-medium">
                  Last: {lastJob.service} — {lastJob.date}
                </div>
              )}

              {client.notes && (
                <p className="mt-2 text-xs text-muted-foreground italic">{client.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientsPage;
