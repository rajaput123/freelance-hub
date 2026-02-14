import { useAppData } from "@/context/AppContext";
import AddClientSheet from "@/components/AddClientSheet";
import { Plus, Phone, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientsPage = () => {
  const { clients, jobs } = useAppData();

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clients</h1>
          <AddClientSheet
            trigger={
              <Button size="icon" className="rounded-xl h-10 w-10">
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
            <div key={client.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {client.phone || "No phone"}
                    </p>
                  </div>
                </div>
              </div>

              {client.location && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {client.location}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" /> {clientJobs.length} jobs
                </span>
                <span className="font-semibold">₹{client.totalSpent.toLocaleString()} total</span>
              </div>

              {lastJob && (
                <div className="mt-2 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
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
