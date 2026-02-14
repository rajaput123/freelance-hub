import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/context/AppContext";
import { Job } from "@/data/types";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Play, CheckCircle, Wallet, Package, CalendarCheck, ArrowUpRight, StickyNote, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDetailSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailSheet = ({ job, open, onOpenChange }: JobDetailSheetProps) => {
  const { updateJobStatus, addPayment, updateJobNotes, addJobMaterials, convertJobToEvent } = useAppData();
  const [showPayment, setShowPayment] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"cash" | "upi" | "bank">("cash");
  const [editNotes, setEditNotes] = useState("");
  const [matName, setMatName] = useState("");
  const [matQty, setMatQty] = useState("");
  const [matCost, setMatCost] = useState("");

  if (!job) return null;

  const remaining = job.amount - job.paidAmount;
  const isConverted = !!job.convertedToEventId;

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

  const handleAddMaterial = () => {
    if (!matName || !matQty) { toast.error("Material name and quantity required"); return; }
    addJobMaterials(job.id, [{ name: matName, qty: Number(matQty), cost: Number(matCost) || 0 }]);
    toast.success("Material added!");
    setMatName(""); setMatQty(""); setMatCost("");
    setShowMaterials(false);
  };

  const handleConvert = () => {
    convertJobToEvent(job.id);
    toast.success("Converted to Event! Check Events section.");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left flex items-center gap-2.5 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {job.service}
            <StatusBadge status={job.status} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {/* Job info */}
          <div className="bg-muted/50 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow/50">
                {job.clientName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{job.clientName}</p>
                <p className="text-xs text-muted-foreground font-medium">{job.service}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground ml-[52px]">
              <span className="flex items-center gap-1 bg-card rounded-lg px-2 py-1"><Clock className="h-3 w-3" /> {job.date} · {job.time}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-[52px]">
              <span className="flex items-center gap-1 bg-card rounded-lg px-2 py-1"><MapPin className="h-3 w-3" /> {job.location}</span>
            </div>
            {job.notes && <p className="text-xs text-muted-foreground ml-[52px] italic">"{job.notes}"</p>}
          </div>

          {isConverted && (
            <div className="bg-info/10 rounded-2xl p-3.5 flex items-center gap-2.5">
              <ArrowUpRight className="h-4 w-4 text-info" />
              <p className="text-xs font-semibold text-info">Converted to Event/Project</p>
            </div>
          )}

          {/* Materials */}
          {job.materials.length > 0 && (
            <div className="bg-card rounded-2xl p-3.5 shadow-soft">
              <h4 className="font-bold text-xs mb-2 flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Materials Used</h4>
              {job.materials.map((m, i) => (
                <div key={i} className="flex justify-between text-xs py-2 border-b border-border last:border-0">
                  <span className="font-medium">{m.name} × {m.qty}</span>
                  <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{m.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Amount */}
          <div className="flex items-center justify-between gradient-primary rounded-2xl p-4 text-primary-foreground shadow-glow">
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-75 font-semibold">Total</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{job.amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider opacity-75 font-semibold">Due</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{remaining.toLocaleString()}</p>
            </div>
          </div>

          {/* Primary Actions */}
          {!isConverted && (
            <div className="space-y-2.5">
              {job.status === "pending" && (
                <Button
                  onClick={() => { updateJobStatus(job.id, "scheduled"); toast.success("Request approved & scheduled!"); }}
                  className="w-full h-12 rounded-2xl gap-2 text-sm font-bold gradient-primary shadow-glow border-0"
                >
                  <CalendarCheck className="h-4 w-4" /> Approve & Schedule
                </Button>
              )}

              {job.status === "scheduled" && (
                <Button
                  onClick={() => { updateJobStatus(job.id, "in_progress"); toast.success("Job started!"); }}
                  className="w-full h-12 rounded-2xl gap-2 text-sm font-bold gradient-primary shadow-glow border-0"
                >
                  <Play className="h-4 w-4" /> Start Job
                </Button>
              )}

              {job.status === "in_progress" && (
                <Button
                  onClick={() => { updateJobStatus(job.id, "completed"); toast.success("Job completed!"); }}
                  className="w-full h-12 rounded-2xl gap-2 text-sm font-bold bg-success hover:bg-success/90 border-0"
                >
                  <CheckCircle className="h-4 w-4" /> Mark Complete
                </Button>
              )}

              {/* Secondary actions */}
              <div className="grid grid-cols-3 gap-2">
                {remaining > 0 && (
                  <button
                    onClick={() => { setShowPayment(!showPayment); setShowNotes(false); setShowMaterials(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold transition-all",
                      showPayment ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card shadow-soft text-muted-foreground"
                    )}
                  >
                    <Wallet className="h-4 w-4" />
                    Payment
                  </button>
                )}
                {(job.status === "in_progress" || job.status === "scheduled") && (
                  <button
                    onClick={() => { setShowMaterials(!showMaterials); setShowPayment(false); setShowNotes(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold transition-all",
                      showMaterials ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card shadow-soft text-muted-foreground"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    Materials
                  </button>
                )}
                <button
                  onClick={() => { setShowNotes(!showNotes); setEditNotes(job.notes); setShowPayment(false); setShowMaterials(false); }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-semibold transition-all",
                    showNotes ? "gradient-primary text-primary-foreground shadow-glow" : "bg-card shadow-soft text-muted-foreground"
                  )}
                >
                  <StickyNote className="h-4 w-4" />
                  Notes
                </button>
              </div>

              {(job.status === "scheduled" || job.status === "in_progress") && (
                <button
                  onClick={handleConvert}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border text-xs font-semibold text-muted-foreground active:bg-muted transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Convert to Event / Project
                </button>
              )}
            </div>
          )}

          {/* Payment form */}
          {showPayment && (
            <div className="bg-card rounded-2xl p-4 space-y-3 shadow-soft">
              <p className="text-xs font-bold mb-1">Record Payment</p>
              <Input placeholder={`Amount (max ₹${remaining})`} value={payAmount} onChange={e => setPayAmount(e.target.value)} type="number" className="h-11 rounded-xl text-sm" autoFocus />
              <Select value={payMethod} onValueChange={v => setPayMethod(v as typeof payMethod)}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handlePayment} className="w-full h-11 rounded-xl text-sm font-bold">Confirm Payment</Button>
            </div>
          )}

          {showNotes && (
            <div className="bg-card rounded-2xl p-4 space-y-3 shadow-soft">
              <p className="text-xs font-bold mb-1">Update Notes</p>
              <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="rounded-xl text-sm" rows={3} autoFocus />
              <Button onClick={() => { updateJobNotes(job.id, editNotes); toast.success("Notes updated!"); setShowNotes(false); }} className="w-full h-11 rounded-xl text-sm font-bold">Save Notes</Button>
            </div>
          )}

          {showMaterials && (
            <div className="bg-card rounded-2xl p-4 space-y-3 shadow-soft">
              <p className="text-xs font-bold mb-1">Add Material</p>
              <Input placeholder="Material name" value={matName} onChange={e => setMatName(e.target.value)} className="h-11 rounded-xl text-sm" autoFocus />
              <div className="flex gap-2">
                <Input placeholder="Qty" value={matQty} onChange={e => setMatQty(e.target.value)} type="number" className="h-11 rounded-xl text-sm flex-1" />
                <Input placeholder="Cost (₹)" value={matCost} onChange={e => setMatCost(e.target.value)} type="number" className="h-11 rounded-xl text-sm flex-1" />
              </div>
              <Button onClick={handleAddMaterial} className="w-full h-11 rounded-xl text-sm font-bold gap-2">
                <Plus className="h-4 w-4" /> Add Material
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobDetailSheet;
