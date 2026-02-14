import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Play, CheckCircle, Wallet, Package } from "lucide-react";

interface JobDetailSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailSheet = ({ job, open, onOpenChange }: JobDetailSheetProps) => {
  const { updateJobStatus, addPayment } = useAppData();
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "upi" | "bank">("cash");

  if (!job) return null;

  const remaining = job.amount - job.paidAmount;

  const handlePayment = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    addPayment({
      jobId: job.id,
      clientName: job.clientName,
      amount: amt,
      method: payMethod,
      date: new Date().toISOString().split("T")[0],
      type: amt >= remaining ? "full" : "partial",
    });
    toast.success("Payment recorded!");
    setShowPayment(false);
    setPayAmount("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-3">
            {job.service}
            <StatusBadge status={job.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-2xl bg-muted/50 p-4 space-y-2">
            <p className="font-semibold text-lg">{job.clientName}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {job.date} at {job.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {job.location}
            </div>
            {job.notes && <p className="text-sm text-muted-foreground mt-2">{job.notes}</p>}
          </div>

          {job.materials.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2"><Package className="h-4 w-4" /> Materials</h4>
              {job.materials.map((m, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{m.name} × {m.qty}</span>
                  <span className="font-medium">₹{m.cost}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl bg-accent p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">₹{job.amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold text-warning">₹{remaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            {job.status === "scheduled" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "in_progress"); toast.success("Job started!"); }}
                className="h-12 rounded-xl gap-2"
              >
                <Play className="h-4 w-4" /> Start Job
              </Button>
            )}
            {job.status === "in_progress" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "completed"); toast.success("Job completed!"); }}
                className="h-12 rounded-xl gap-2 bg-success hover:bg-success/90"
              >
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            )}
            {remaining > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowPayment(!showPayment)}
                className="h-12 rounded-xl gap-2"
              >
                <Wallet className="h-4 w-4" /> Record Payment
              </Button>
            )}
          </div>

          {showPayment && (
            <div className="rounded-2xl border border-border p-4 space-y-3">
              <Input
                placeholder={`Amount (max ₹${remaining})`}
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                type="number"
                className="h-12 rounded-xl text-base"
                autoFocus
              />
              <Select value={payMethod} onValueChange={v => setPayMethod(v as typeof payMethod)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handlePayment} className="w-full h-12 rounded-xl">
                Confirm Payment
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobDetailSheet;
