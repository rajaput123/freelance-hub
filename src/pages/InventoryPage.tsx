import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Package, Plus, AlertTriangle, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const InventoryPage = () => {
  const { inventory, addInventoryItem, updateInventoryStock } = useAppData();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [minStock, setMinStock] = useState("");

  const totalValue = inventory.reduce((s, i) => s + i.stock * i.costPerUnit, 0);
  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);

  const grouped = inventory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof inventory>);

  const handleAdd = () => {
    if (!name || !stock) { toast.error("Name and stock required"); return; }
    addInventoryItem({ name, category: category || "General", stock: Number(stock), unit, costPerUnit: Number(costPerUnit) || 0, minStock: Number(minStock) || 5 });
    toast.success("Item added!");
    setName(""); setCategory(""); setStock(""); setCostPerUnit(""); setMinStock("");
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Inventory</h1>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow active:scale-95 transition-transform">
            <Plus className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 mt-4">
        <div className="flex gap-2.5">
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-soft">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              <Package className="h-3 w-3" /> Total Value
            </div>
            <p className="text-xl font-bold mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{totalValue.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-soft">
            <div className="flex items-center gap-1.5 text-[10px] text-warning font-bold uppercase tracking-wider">
              <AlertTriangle className="h-3 w-3" /> Low Stock
            </div>
            <p className="text-xl font-bold text-warning mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="px-4 mt-4">
          <div className="bg-card rounded-2xl p-4 space-y-3 shadow-soft">
            <p className="text-xs font-bold">Add Inventory Item</p>
            <Input placeholder="Item name *" value={name} onChange={e => setName(e.target.value)} className="h-11 rounded-xl text-sm" autoFocus />
            <div className="flex gap-2">
              <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="h-11 rounded-xl text-sm flex-1" />
              <Input placeholder="Unit" value={unit} onChange={e => setUnit(e.target.value)} className="h-11 rounded-xl text-sm w-20" />
            </div>
            <div className="flex gap-2">
              <Input placeholder="Stock *" value={stock} onChange={e => setStock(e.target.value)} type="number" className="h-11 rounded-xl text-sm flex-1" />
              <Input placeholder="₹/unit" value={costPerUnit} onChange={e => setCostPerUnit(e.target.value)} type="number" className="h-11 rounded-xl text-sm flex-1" />
              <Input placeholder="Min" value={minStock} onChange={e => setMinStock(e.target.value)} type="number" className="h-11 rounded-xl text-sm w-16" />
            </div>
            <Button onClick={handleAdd} className="w-full h-11 rounded-xl text-sm font-bold gradient-primary shadow-glow border-0">Add Item</Button>
          </div>
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div className="px-4 mt-4">
          <div className="bg-warning/10 rounded-2xl p-3.5">
            <p className="text-xs font-bold text-warning flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Alert
            </p>
            <div className="space-y-1.5">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-warning font-bold">{item.stock} {item.unit} left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mt-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{cat}</p>
            <div className="space-y-2">
              {items.map(item => {
                const isLow = item.stock <= item.minStock;
                return (
                  <div key={item.id} className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-soft">
                    <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0", isLow ? "bg-warning/10" : "bg-muted")}>
                      {isLow ? <TrendingDown className="h-[18px] w-[18px] text-warning" /> : <Package className="h-[18px] w-[18px] text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.stock} {item.unit} · ₹{item.costPerUnit}/{item.unit}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { updateInventoryStock(item.id, -1); toast(`Removed 1 ${item.unit}`); }} className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-sm font-bold active:scale-95 transition-transform">−</button>
                      <button onClick={() => { updateInventoryStock(item.id, 1); toast(`Added 1 ${item.unit}`); }} className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-sm font-bold active:scale-95 transition-transform">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;
