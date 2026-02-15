import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, FreelancerEvent } from "@/data/types";
import { useAppData } from "@/context/AppContext";
import { toast } from "sonner";
import { Receipt, Package, Users, Truck, Wrench } from "lucide-react";

interface ExpenseRecordSheetProps {
  item: Job | FreelancerEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const expenseCategories = [
  { value: "materials", label: "Materials", icon: Package },
  { value: "helpers", label: "Helpers", icon: Users },
  { value: "transport", label: "Transport", icon: Truck },
  { value: "tools", label: "Tools/Equipment", icon: Wrench },
  { value: "other", label: "Other", icon: Receipt },
];

const ExpenseRecordSheet = ({ item, open, onOpenChange }: ExpenseRecordSheetProps) => {
  const { addEventExpense, addJobExpense } = useAppData();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("materials");
  const [isLoading, setIsLoading] = useState(false);

  if (!item) return null;

  const isJob = "service" in item;

  const handleRecord = () => {
    if (!description.trim() || !amount || Number(amount) <= 0) {
      toast.error("Please enter description and amount");
      return;
    }

    setIsLoading(true);
    try {
      if (isJob) {
        addJobExpense(item.id, `${category}: ${description}`, Number(amount));
        toast.success("Expense recorded!");
      } else {
        addEventExpense(item.id, `${category}: ${description}`, Number(amount));
        toast.success("Expense recorded!");
      }
      setDescription("");
      setAmount("");
      setCategory("materials");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to record expense");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = expenseCategories.find(c => c.value === category);
  const CategoryIcon = selectedCategory?.icon || Receipt;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Record Expense
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Item Info */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="font-bold text-sm mb-1">{item.clientName}</p>
            <p className="text-xs text-muted-foreground">
              {isJob ? item.service : item.title}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 rounded-xl text-base">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Description
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Bought 5kg paint, Paid helper wages"
              className="h-12 rounded-xl text-base"
              autoFocus
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Amount (₹)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="h-12 rounded-xl text-base font-bold"
              min={1}
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleRecord}
            disabled={isLoading || !description.trim() || !amount || Number(amount) <= 0}
            className="w-full h-12 rounded-2xl text-base font-bold bg-destructive hover:bg-destructive/90 text-white border-0 disabled:opacity-50"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Record Expense
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExpenseRecordSheet;
