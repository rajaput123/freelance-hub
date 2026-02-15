import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, Package, Plus, AlertTriangle, TrendingDown, Search, X, History, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const InventoryPage = () => {
  const { inventory, addInventoryItem, updateInventoryStock, jobs, events } = useAppData();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [minStock, setMinStock] = useState("");

  const totalValue = inventory.reduce((s, i) => s + i.stock * i.costPerUnit, 0);
  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
  // Get categories from existing inventory items
  const existingCategories = Array.from(new Set(inventory.map(i => i.category)));
  // Common categories that are always available
  const commonCategories = ["General", "Materials", "Tools", "Equipment", "Supplies", "Parts", "Electrical", "Decoration", "Flowers", "Other"];
  // Combine and deduplicate
  const allCategories = Array.from(new Set([...existingCategories, ...commonCategories])).sort();

  // Filter and search
  const filteredInventory = useMemo(() => {
    let filtered = inventory;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Low stock filter
    if (showLowStockOnly) {
      filtered = filtered.filter(item => item.stock <= item.minStock);
    }

    return filtered;
  }, [inventory, searchQuery, filterCategory, showLowStockOnly]);

  // Group by category
  const grouped = filteredInventory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof filteredInventory>);

  // Get usage history for an item
  const getUsageHistory = (itemName: string) => {
    const usage: Array<{ type: "job" | "event"; id: string; name: string; date: string; qty: number }> = [];

    // Check jobs
    jobs.forEach(job => {
      job.materials.forEach(mat => {
        if (mat.name.toLowerCase().includes(itemName.toLowerCase())) {
          usage.push({
            type: "job",
            id: job.id,
            name: `${job.clientName} - ${job.service}`,
            date: job.date,
            qty: mat.qty,
          });
        }
      });
    });

    // Check events
    events.forEach(event => {
      event.materials.forEach(mat => {
        if (mat.name.toLowerCase().includes(itemName.toLowerCase())) {
          usage.push({
            type: "event",
            id: event.id,
            name: event.title,
            date: event.date,
            qty: mat.qty,
          });
        }
      });
    });

    return usage.sort((a, b) => b.date.localeCompare(a.date));
  };

  const handleAdd = () => {
    if (!name || !stock) {
      toast.error("Name and stock required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }
    addInventoryItem({
      name,
      category: category,
      stock: Number(stock),
      unit,
      costPerUnit: Number(costPerUnit) || 0,
      minStock: Number(minStock) || 5,
    });
    toast.success("Item added!");
    setName("");
    setCategory("");
    setNewCategory("");
    setShowNewCategoryInput(false);
    setStock("");
    setCostPerUnit("");
    setMinStock("");
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Inventory
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl text-sm pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-10 rounded-xl text-sm flex-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={cn(
                "h-10 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all",
                showLowStockOnly
                  ? "bg-warning/20 text-warning border-2 border-warning/50"
                  : "bg-muted text-muted-foreground border-2 border-transparent"
              )}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Low Stock
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 mt-4">
        <div className="flex gap-2.5">
          <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              <Package className="h-3 w-3" /> Total Value
            </div>
            <p className="text-xl font-bold mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ₹{totalValue.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
            <div className="flex items-center gap-1.5 text-[10px] text-warning font-bold uppercase tracking-wider">
              <AlertTriangle className="h-3 w-3" /> Low Stock
            </div>
            <p className="text-xl font-bold text-warning mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {lowStockItems.length}
            </p>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      {showAdd && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-4 space-y-3 shadow-lg border border-border/20">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">Add Inventory Item</p>
              <button
                onClick={() => setShowAdd(false)}
                className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <Input
              placeholder="Item name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl text-sm"
              autoFocus
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                {!showNewCategoryInput ? (
                  <>
                    <Select 
                      value={category} 
                      onValueChange={(value) => {
                        if (value === "new") {
                          setShowNewCategoryInput(true);
                        } else {
                          setCategory(value);
                        }
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl text-sm flex-1">
                        <SelectValue placeholder="Category *" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                        <div className="border-t border-border my-1" />
                        <SelectItem value="new" className="text-primary font-semibold">
                          + Create New Category
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-11 rounded-xl text-sm w-24"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="New category name *"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="h-11 rounded-xl text-sm flex-1"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (newCategory.trim()) {
                          setCategory(newCategory.trim());
                          setNewCategory("");
                          setShowNewCategoryInput(false);
                        }
                      }}
                      className="h-11 px-3 rounded-xl bg-success/10 text-success font-semibold text-sm active:scale-95"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory("");
                      }}
                      className="h-11 px-3 rounded-xl bg-muted text-muted-foreground font-semibold text-sm active:scale-95"
                    >
                      ✕
                    </button>
                    <Input
                      placeholder="Unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-11 rounded-xl text-sm w-24"
                    />
                  </>
                )}
              </div>
              {category && !showNewCategoryInput && (
                <p className="text-xs text-muted-foreground">
                  Selected: <span className="font-semibold text-foreground">{category}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Stock *"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                type="number"
                className="h-11 rounded-xl text-sm flex-1"
              />
              <Input
                placeholder="₹/unit"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                type="number"
                className="h-11 rounded-xl text-sm flex-1"
              />
              <Input
                placeholder="Min"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                type="number"
                className="h-11 rounded-xl text-sm w-20"
              />
            </div>
            <Button onClick={handleAdd} className="w-full h-11 rounded-xl text-sm font-bold gradient-primary shadow-glow border-0">
              Add Item
            </Button>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && !showLowStockOnly && (
        <div className="px-4 mt-4">
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-3.5">
            <p className="text-xs font-bold text-warning flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3.5 w-3.5" /> Low Stock Alert
            </p>
            <div className="space-y-1.5">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-warning font-bold">
                    {item.stock} {item.unit} left
                  </span>
                </div>
              ))}
              {lowStockItems.length > 3 && (
                <p className="text-[10px] text-muted-foreground">
                  +{lowStockItems.length - 3} more items running low
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="px-4 mt-4">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground">No items found</p>
            <p className="text-xs text-muted-foreground mt-1">Add items to track your inventory</p>
          </div>
        ) : (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
                {cat}
              </p>
              <div className="space-y-2">
                {items.map((item) => {
                  const isLow = item.stock <= item.minStock;
                  const usageHistory = getUsageHistory(item.name);

                  return (
                    <div key={item.id}>
                      <div
                        className={cn(
                          "flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20 cursor-pointer active:scale-[0.98] transition-all",
                          isLow && "border-warning/30 bg-warning/5"
                        )}
                        onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0",
                            isLow ? "bg-warning/10" : "bg-muted"
                          )}
                        >
                          {isLow ? (
                            <TrendingDown className="h-[18px] w-[18px] text-warning" />
                          ) : (
                            <Package className="h-[18px] w-[18px] text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">{item.name}</p>
                            {isLow && (
                              <span className="text-[9px] font-bold text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                                Low
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">
                            {item.stock} {item.unit} · ₹{item.costPerUnit}/{item.unit}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Value: ₹{(item.stock * item.costPerUnit).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInventoryStock(item.id, -1);
                              toast.success(`Removed 1 ${item.unit}`);
                            }}
                            className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-sm font-bold active:scale-95 transition-transform"
                          >
                            −
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateInventoryStock(item.id, 1);
                              toast.success(`Added 1 ${item.unit}`);
                            }}
                            className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-sm font-bold active:scale-95 transition-transform"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Usage History */}
                      {selectedItem === item.id && usageHistory.length > 0 && (
                        <div className="mt-2 bg-white rounded-xl p-3 border border-border/20">
                          <div className="flex items-center gap-2 mb-2">
                            <History className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="text-xs font-bold text-foreground">Usage History</p>
                          </div>
                          <div className="space-y-1.5">
                            {usageHistory.slice(0, 5).map((usage, i) => (
                              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-border/30 last:border-0">
                                <div>
                                  <p className="font-semibold">{usage.name}</p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {usage.type === "job" ? "Job" : "Event"} · {usage.date}
                                  </p>
                                </div>
                                <p className="font-bold text-primary">{usage.qty} {item.unit}</p>
                              </div>
                            ))}
                            {usageHistory.length > 5 && (
                              <p className="text-[10px] text-muted-foreground text-center pt-1">
                                +{usageHistory.length - 5} more uses
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
