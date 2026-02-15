import { useState } from "react";
import { InventoryItem, Material } from "@/data/types";
import { useAppData } from "@/context/AppContext";
import { Package, Plus, Minus, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MaterialSelectorProps {
  selectedMaterials: Material[];
  onMaterialsChange: (materials: Material[]) => void;
  jobId?: string;
  eventId?: string;
  serviceCategory?: string; // Filter inventory by service category
}

const MaterialSelector = ({ selectedMaterials, onMaterialsChange, jobId, eventId, serviceCategory }: MaterialSelectorProps) => {
  const { inventory } = useAppData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelector, setShowSelector] = useState(false);

  // Filter inventory by service category if provided, otherwise show all
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If service category is provided, prioritize items with matching category
    if (serviceCategory) {
      // Show matching category items first, but also show all items if search is active
      if (searchQuery) {
        return matchesSearch; // Show all matching items when searching
      }
      // When no search, show matching category items + selected items
      return item.category === serviceCategory || 
             selectedMaterials.some(m => m.name === item.name);
    }
    
    return matchesSearch;
  });

  const getSelectedQty = (itemId: string) => {
    const selected = selectedMaterials.find(m => m.name === inventory.find(i => i.id === itemId)?.name);
    return selected?.qty || 0;
  };

  const updateMaterial = (item: InventoryItem, delta: number) => {
    if (!item) return;
    
    const currentQty = getSelectedQty(item.id);
    const newQty = Math.max(0, currentQty + delta);
    const availableStock = item.stock;

    if (newQty > availableStock) {
      toast.error(`Only ${availableStock} ${item.unit} available`);
      return;
    }

    const updatedMaterials = [...selectedMaterials];
    const existingIndex = updatedMaterials.findIndex(m => m.name === item.name);

    if (newQty === 0) {
      // Remove material
      if (existingIndex >= 0) {
        updatedMaterials.splice(existingIndex, 1);
      }
    } else {
      // Add or update material
      const material: Material = {
        name: item.name,
        qty: newQty,
        cost: item.costPerUnit * newQty,
      };
      if (existingIndex >= 0) {
        updatedMaterials[existingIndex] = material;
      } else {
        updatedMaterials.push(material);
      }
    }

    onMaterialsChange(updatedMaterials);
  };

  const removeMaterial = (materialName: string) => {
    onMaterialsChange(selectedMaterials.filter(m => m.name !== materialName));
  };

  const totalCost = selectedMaterials.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="space-y-3">
      {/* Selected Materials Summary */}
      {selectedMaterials.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Selected Materials</p>
            <p className="text-xs text-muted-foreground">
              Total: <span className="font-bold text-foreground">₹{totalCost.toLocaleString()}</span>
            </p>
          </div>
          <div className="space-y-2">
            {selectedMaterials.map((mat, i) => {
              const inventoryItem = inventory.find(inv => inv.name === mat.name);
              if (!inventoryItem) {
                // Material not in inventory - allow manual removal only
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-muted/50 rounded-xl p-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{mat.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {mat.qty} pcs · ₹{mat.cost.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeMaterial(mat.name)}
                      className="h-7 w-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="flex items-center justify-between bg-muted/50 rounded-xl p-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{mat.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {mat.qty} {inventoryItem.unit} · ₹{mat.cost.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateMaterial(inventoryItem, -1)}
                      className="h-7 w-7 rounded-lg bg-background flex items-center justify-center active:scale-95"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{mat.qty}</span>
                    <button
                      onClick={() => updateMaterial(inventoryItem, 1)}
                      className="h-7 w-7 rounded-lg bg-background flex items-center justify-center active:scale-95"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeMaterial(mat.name)}
                      className="h-7 w-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-95"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Material Selector */}
      <div>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all",
            showSelector ? "border-primary bg-primary/5" : "border-border bg-white"
          )}
        >
          <span className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Select Materials
          </span>
          <span className="text-xs text-muted-foreground">
            {selectedMaterials.length} selected
          </span>
        </button>

        {showSelector && (
          <div className="mt-2 bg-white rounded-xl p-3 space-y-2 border border-border">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-lg text-sm pl-9"
              />
            </div>

            {/* Inventory List */}
            <div className="max-h-60 overflow-y-auto space-y-1.5">
              {filteredInventory.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No materials found</p>
              ) : (
                filteredInventory.map((item) => {
                  const selectedQty = getSelectedQty(item.id);
                  const isLow = item.stock <= item.minStock;
                  const isOutOfStock = item.stock === 0;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg border",
                        selectedQty > 0 ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-border/30",
                        isOutOfStock && "opacity-50"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold truncate">{item.name}</p>
                          {isLow && !isOutOfStock && (
                            <span className="text-[9px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                              Low
                            </span>
                          )}
                          {isOutOfStock && (
                            <span className="text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                              Out
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Stock: {item.stock} {item.unit} · ₹{item.costPerUnit}/{item.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedQty > 0 && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateMaterial(item, -1)}
                              disabled={isOutOfStock}
                              className="h-7 w-7 rounded-lg bg-background flex items-center justify-center active:scale-95 disabled:opacity-50"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{selectedQty}</span>
                          </div>
                        )}
                        <button
                          onClick={() => updateMaterial(item, 1)}
                          disabled={isOutOfStock || item.stock === selectedQty}
                          className={cn(
                            "h-7 px-2 rounded-lg text-xs font-semibold active:scale-95",
                            selectedQty > 0
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground",
                            (isOutOfStock || item.stock === selectedQty) && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {selectedQty > 0 ? "+" : "Add"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialSelector;
