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
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-2 text-base">
            {job.service}
            <StatusBadge status={job.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {/* Job info */}
          <div className="bg-muted/40 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/8 text-primary flex items-center justify-center font-semibold text-sm">
                {job.clientName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{job.clientName}</p>
                <p className="text-xs text-muted-foreground">{job.service}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground ml-12">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.date} · {job.time}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-12">
              <MapPin className="h-3 w-3" /> {job.location}
            </div>
            {job.notes && <p className="text-xs text-muted-foreground ml-12">{job.notes}</p>}
          </div>

          {/* Materials */}
          {job.materials.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-2 flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Materials</h4>
              {job.materials.map((m, i) => (
                <div key={i} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                  <span>{m.name} × {m.qty}</span>
                  <span className="font-semibold">₹{m.cost}</span>
                </div>
              ))}
            </div>
          )}

          {/* Amount */}
          <div className="flex items-center justify-between bg-primary rounded-xl p-3 text-primary-foreground">
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-70">Total</p>
              <p className="text-xl font-bold">₹{job.amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider opacity-70">Due</p>
              <p className="text-xl font-bold">₹{remaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {job.status === "scheduled" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "in_progress"); toast.success("Job started!"); }}
                className="flex-1 h-10 rounded-lg gap-2 text-sm"
              >
                <Play className="h-4 w-4" /> Start Job
              </Button>
            )}
            {job.status === "in_progress" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "completed"); toast.success("Job completed!"); }}
                className="flex-1 h-10 rounded-lg gap-2 text-sm bg-success hover:bg-success/90"
              >
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            )}
            {remaining > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowPayment(!showPayment)}
                className="flex-1 h-10 rounded-lg gap-2 text-sm"
              >
                <Wallet className="h-4 w-4" /> Payment
              </Button>
            )}
          </div>

          {/* Payment form */}
          {showPayment && (
            <div className="border border-border rounded-xl p-3 space-y-2.5">
              <Input
                placeholder={`Amount (max ₹${remaining})`}
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                type="number"
                className="h-10 rounded-lg text-sm"
                autoFocus
              />
              <Select value={payMethod} onValueChange={v => setPayMethod(v as typeof payMethod)}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handlePayment} className="w-full h-10 rounded-lg text-sm font-semibold">
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
