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
      <SheetContent side="bottom" className="rounded-t-[2rem] max-h-[90vh] overflow-y-auto border-t border-border/50">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-3 tracking-tight">
            {job.service}
            <StatusBadge status={job.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-5 space-y-4">
          <div className="rounded-2xl bg-muted/40 border border-border/40 p-4 space-y-2.5">
            <p className="font-bold text-lg">{job.clientName}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {job.date} at {job.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {job.location}
            </div>
            {job.notes && <p className="text-sm text-muted-foreground">{job.notes}</p>}
          </div>

          {job.materials.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm"><Package className="h-4 w-4" /> Materials</h4>
              {job.materials.map((m, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border/30 last:border-0">
                  <span>{m.name} × {m.qty}</span>
                  <span className="font-semibold">₹{m.cost}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl gradient-primary p-4 text-primary-foreground">
            <div>
              <p className="text-xs opacity-70 font-medium uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold">₹{job.amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 font-medium uppercase tracking-wider">Remaining</p>
              <p className="text-2xl font-bold">₹{remaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            {job.status === "scheduled" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "in_progress"); toast.success("Job started!"); }}
                className="h-12 rounded-xl gap-2 gradient-primary border-0 shadow-card"
              >
                <Play className="h-4 w-4" /> Start Job
              </Button>
            )}
            {job.status === "in_progress" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "completed"); toast.success("Job completed!"); }}
                className="h-12 rounded-xl gap-2 bg-success hover:bg-success/90 border-0"
              >
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            )}
            {remaining > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowPayment(!showPayment)}
                className="h-12 rounded-xl gap-2 border-border/60"
              >
                <Wallet className="h-4 w-4" /> Record Payment
              </Button>
            )}
          </div>

          {showPayment && (
            <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-card">
              <Input
                placeholder={`Amount (max ₹${remaining})`}
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                type="number"
                className="h-12 rounded-xl text-base border-border/60"
                autoFocus
              />
              <Select value={payMethod} onValueChange={v => setPayMethod(v as typeof payMethod)}>
                <SelectTrigger className="h-12 rounded-xl border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handlePayment} className="w-full h-12 rounded-xl gradient-primary border-0 shadow-card">
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
