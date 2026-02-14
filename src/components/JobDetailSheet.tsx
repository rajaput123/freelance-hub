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
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
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
            {job.notes && <p className="text-xs text-muted-foreground ml-12 italic">"{job.notes}"</p>}
          </div>

          {/* Converted notice */}
          {isConverted && (
            <div className="bg-info/10 rounded-xl p-3 flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-info" />
              <p className="text-xs font-medium text-info">This job was converted to an Event/Project</p>
            </div>
          )}

          {/* Materials */}
          {job.materials.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-2 flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Materials Used</h4>
              {job.materials.map((m, i) => (
                <div key={i} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                  <span>{m.name} × {m.qty}</span>
                  <span className="font-semibold">₹{m.cost.toLocaleString()}</span>
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

          {/* Primary Actions — Lifecycle */}
          {!isConverted && (
            <div className="space-y-2">
              {/* Pending → Approve (Schedule) */}
              {job.status === "pending" && (
                <Button
                  onClick={() => { updateJobStatus(job.id, "scheduled"); toast.success("Request approved & scheduled!"); }}
                  className="w-full h-11 rounded-xl gap-2 text-sm font-semibold"
                >
                  <CalendarCheck className="h-4 w-4" /> Approve & Schedule
                </Button>
              )}

              {/* Scheduled → Start */}
              {job.status === "scheduled" && (
                <Button
                  onClick={() => { updateJobStatus(job.id, "in_progress"); toast.success("Job started!"); }}
                  className="w-full h-11 rounded-xl gap-2 text-sm font-semibold"
                >
                  <Play className="h-4 w-4" /> Start Job
                </Button>
              )}

              {/* In Progress → Complete */}
              {job.status === "in_progress" && (
                <Button
                  onClick={() => { updateJobStatus(job.id, "completed"); toast.success("Job completed!"); }}
                  className="w-full h-11 rounded-xl gap-2 text-sm font-semibold bg-success hover:bg-success/90"
                >
                  <CheckCircle className="h-4 w-4" /> Mark Complete
                </Button>
              )}

              {/* Secondary actions row */}
              <div className="grid grid-cols-3 gap-2">
                {remaining > 0 && (
                  <button
                    onClick={() => { setShowPayment(!showPayment); setShowNotes(false); setShowMaterials(false); }}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors",
                      showPayment ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
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
                      "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors",
                      showMaterials ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                    )}
                  >
                    <Package className="h-4 w-4" />
                    Materials
                  </button>
                )}
                <button
                  onClick={() => { setShowNotes(!showNotes); setEditNotes(job.notes); setShowPayment(false); setShowMaterials(false); }}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors",
                    showNotes ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                  )}
                >
                  <StickyNote className="h-4 w-4" />
                  Notes
                </button>
              </div>

              {/* Convert to Event */}
              {(job.status === "scheduled" || job.status === "in_progress") && (
                <button
                  onClick={handleConvert}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-xs font-medium text-muted-foreground active:bg-muted/40 transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Convert to Event / Project
                </button>
              )}
            </div>
          )}

          {/* Payment form */}
          {showPayment && (
            <div className="border border-border rounded-xl p-3 space-y-2.5">
              <p className="text-xs font-semibold mb-1">Record Payment</p>
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

          {/* Notes form */}
          {showNotes && (
            <div className="border border-border rounded-xl p-3 space-y-2.5">
              <p className="text-xs font-semibold mb-1">Update Notes</p>
              <Textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                className="rounded-lg text-sm"
                rows={3}
                autoFocus
              />
              <Button onClick={() => { updateJobNotes(job.id, editNotes); toast.success("Notes updated!"); setShowNotes(false); }} className="w-full h-10 rounded-lg text-sm font-semibold">
                Save Notes
              </Button>
            </div>
          )}

          {/* Materials form */}
          {showMaterials && (
            <div className="border border-border rounded-xl p-3 space-y-2.5">
              <p className="text-xs font-semibold mb-1">Add Material</p>
              <Input placeholder="Material name" value={matName} onChange={e => setMatName(e.target.value)} className="h-10 rounded-lg text-sm" autoFocus />
              <div className="flex gap-2">
                <Input placeholder="Qty" value={matQty} onChange={e => setMatQty(e.target.value)} type="number" className="h-10 rounded-lg text-sm flex-1" />
                <Input placeholder="Cost (₹)" value={matCost} onChange={e => setMatCost(e.target.value)} type="number" className="h-10 rounded-lg text-sm flex-1" />
              </div>
              <Button onClick={handleAddMaterial} className="w-full h-10 rounded-lg text-sm font-semibold gap-2">
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
