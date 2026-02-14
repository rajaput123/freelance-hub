import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Play, CheckCircle, Wallet, Package, IndianRupee } from "lucide-react";

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
          <SheetTitle className="text-left flex items-center gap-2.5 text-lg">
            {job.service}
            <StatusBadge status={job.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Job info card */}
          <div className="rounded-2xl bg-muted/30 border border-border/40 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {job.clientName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[15px]">{job.clientName}</p>
                <p className="text-[12px] text-muted-foreground">{job.service}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.date} · {job.time}</span>
            </div>
            <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </div>
            {job.notes && <p className="text-[12px] text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-1.5 mt-1">{job.notes}</p>}
          </div>

          {/* Materials */}
          {job.materials.length > 0 && (
            <div>
              <h4 className="font-semibold text-[13px] mb-2 flex items-center gap-2"><Package className="h-4 w-4" /> Materials</h4>
              {job.materials.map((m, i) => (
                <div key={i} className="flex justify-between text-[13px] py-1.5 border-b border-border/30 last:border-0">
                  <span>{m.name} × {m.qty}</span>
                  <span className="font-semibold">₹{m.cost}</span>
                </div>
              ))}
            </div>
          )}

          {/* Amount summary */}
          <div className="flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground">
            <div>
              <p className="text-[11px] opacity-70 font-semibold uppercase tracking-wider">Total</p>
              <p className="text-2xl font-extrabold flex items-center"><IndianRupee className="h-5 w-5" />{job.amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] opacity-70 font-semibold uppercase tracking-wider">Due</p>
              <p className="text-2xl font-extrabold">₹{remaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            {job.status === "scheduled" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "in_progress"); toast.success("Job started!"); }}
                className="h-12 rounded-xl gap-2 text-[14px] font-semibold"
              >
                <Play className="h-4 w-4" /> Start Job
              </Button>
            )}
            {job.status === "in_progress" && (
              <Button
                onClick={() => { updateJobStatus(job.id, "completed"); toast.success("Job completed!"); }}
                className="h-12 rounded-xl gap-2 text-[14px] font-semibold bg-success hover:bg-success/90"
              >
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            )}
            {remaining > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowPayment(!showPayment)}
                className="h-12 rounded-xl gap-2 text-[14px] font-semibold"
              >
                <Wallet className="h-4 w-4" /> Payment
              </Button>
            )}
          </div>

          {/* Payment form */}
          {showPayment && (
            <div className="rounded-2xl border border-border p-4 space-y-3">
              <Input
                placeholder={`Amount (max ₹${remaining})`}
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                type="number"
                className="h-12 rounded-xl text-[14px]"
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
              <Button onClick={handlePayment} className="w-full h-12 rounded-xl font-bold text-[14px]">
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
