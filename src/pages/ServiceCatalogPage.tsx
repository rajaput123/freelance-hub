import { services } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const ServiceCatalogPage = () => {
  const navigate = useNavigate();

  const grouped = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Service Catalog</h1>
        </div>
      </div>

      <div className="px-4 mt-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{category}</p>
            <div className="space-y-2">
              {items.map(service => (
                <div key={service.id} className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-soft">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-[18px] w-[18px] text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{service.category}</p>
                  </div>
                  <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{service.defaultRate.toLocaleString()}</p>
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
