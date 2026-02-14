import { services } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const ServiceCatalogPage = () => {
  const navigate = useNavigate();

  // Group by category
  const grouped = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">Service Catalog</h1>
        </div>
      </div>

      <div className="px-4 mt-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</p>
            <div className="space-y-2">
              {items.map(service => (
                <div key={service.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="h-9 w-9 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.category}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground">₹{service.defaultRate.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCatalogPage;
