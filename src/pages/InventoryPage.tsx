import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

const InventoryPage = () => {
  const { jobs, events } = useAppData();
  const navigate = useNavigate();

  // Aggregate materials from jobs and events
  const allMaterials: { name: string; qty: number; cost: number; source: string }[] = [];

  jobs.forEach(j => {
    j.materials.forEach(m => {
      allMaterials.push({ ...m, source: `Job: ${j.service}` });
    });
  });

  events.forEach(e => {
    e.materials.forEach(m => {
      allMaterials.push({ ...m, source: `Event: ${e.title}` });
    });
  });

  const totalCost = allMaterials.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">Inventory & Materials</h1>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 mt-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Materials Cost</p>
            <p className="text-xl font-bold mt-0.5">₹{totalCost.toLocaleString()}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-warning/8 flex items-center justify-center">
            <Package className="h-5 w-5 text-warning" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-2">
        {allMaterials.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No materials tracked yet</p>
          </div>
        ) : (
          allMaterials.map((m, i) => (
            <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <div className="h-9 w-9 rounded-full bg-warning/8 flex items-center justify-center shrink-0">
                <Package className="h-4 w-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {m.qty} · {m.source}</p>
              </div>
              <p className="text-sm font-bold text-foreground">₹{m.cost.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
