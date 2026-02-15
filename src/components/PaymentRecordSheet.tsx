import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Job, FreelancerEvent, Payment } from "@/data/types";
import { useAppData } from "@/context/AppContext";
import { toast } from "sonner";
import { Wallet, Banknote, Smartphone, Building2 } from "lucide-react";

interface PaymentRecordSheetProps {
  item: Job | FreelancerEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PaymentRecordSheet = ({ item, open, onOpenChange }: PaymentRecordSheetProps) => {
  const { addPayment } = useAppData();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "upi" | "bank">("cash");
  const [isLoading, setIsLoading] = useState(false);

  if (!item) return null;

  const isJob = "service" in item;
  const totalAmount = isJob ? item.amount : item.budget;
  const paidAmount = isJob ? item.paidAmount : item.totalPaid;
  const pendingAmount = totalAmount - paidAmount;
  const maxAmount = pendingAmount;

  const handleRecord = () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const paymentAmount = Number(amount);
    if (paymentAmount > maxAmount) {
      toast.error(`Amount cannot exceed pending ₹${maxAmount.toLocaleString()}`);
      return;
    }

    setIsLoading(true);
    try {
      addPayment({
        [isJob ? "jobId" : "eventId"]: item.id,
        clientName: item.clientName,
        amount: paymentAmount,
        method,
        date: new Date().toISOString().split("T")[0],
        type: paymentAmount >= pendingAmount ? "full" : "partial",
      });
      toast.success("Payment recorded!");
      setAmount("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to record payment");
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [
    { label: "25%", value: Math.floor(maxAmount * 0.25) },
    { label: "50%", value: Math.floor(maxAmount * 0.5) },
    { label: "75%", value: Math.floor(maxAmount * 0.75) },
    { label: "Full", value: maxAmount },
  ].filter(q => q.value > 0);

  const methodIcons = {
    cash: Banknote,
    upi: Smartphone,
    bank: Building2,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Record Payment
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Item Info */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="font-bold text-sm mb-1">{item.clientName}</p>
            <p className="text-xs text-muted-foreground mb-2">
              {isJob ? item.service : item.title}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Paid</span>
              <span className="font-bold text-success">₹{paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1 pt-2 border-t border-border">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-bold text-warning">₹{pendingAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Payment Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="h-12 rounded-xl text-base font-bold"
              max={maxAmount}
              min={1}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum: ₹{maxAmount.toLocaleString()}
            </p>

            {/* Quick Amount Buttons */}
            {quickAmounts.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {quickAmounts.map((quick, i) => (
                  <button
                    key={i}
                    onClick={() => setAmount(quick.value.toString())}
                    className="h-10 rounded-xl border-2 border-primary/30 bg-primary/5 text-primary text-xs font-semibold active:scale-95 transition-all"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Payment Method
            </label>
            <Select value={method} onValueChange={(v) => setMethod(v as "cash" | "upi" | "bank")}>
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    <span>Cash</span>
                  </div>
                </SelectItem>
                <SelectItem value="upi">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>UPI</span>
                  </div>
                </SelectItem>
                <SelectItem value="bank">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            onClick={handleRecord}
            disabled={isLoading || !amount || Number(amount) <= 0}
            className="w-full h-12 rounded-2xl text-base font-bold gradient-primary shadow-glow border-0 disabled:opacity-50"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PaymentRecordSheet;
