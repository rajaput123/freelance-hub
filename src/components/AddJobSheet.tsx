import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import AddClientSheet from "./AddClientSheet";

interface AddJobSheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialStatus?: "pending" | "scheduled";
}

const AddJobSheet = ({ trigger, open: controlledOpen, onOpenChange, initialStatus = "pending" }: AddJobSheetProps) => {
  const { clients, addJob } = useAppData();
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Use user's services instead of mock data
  const userServices = user?.services || [];

  const selectedClient = clients.find(c => c.id === clientId);
  const selectedService = userServices.find(s => s.name === service);

  const handleClientAdded = (newClientId: string) => { setClientId(newClientId); };

  const handleServiceChange = (val: string) => {
    setService(val);
    const svc = userServices.find(s => s.name === val);
    if (svc && !amount) setAmount(String(svc.price));
  };

  const handleSave = () => {
    if (!clientId || !service || !date) { toast.error("Client, service, and date are required"); return; }
    const client = clients.find(c => c.id === clientId);
    addJob({
      clientId,
      clientName: client?.name || "",
      service,
      date,
      time,
      location: location || client?.location || "",
      status: initialStatus,
      amount: Number(amount) || selectedService?.price || 0,
      paidAmount: 0,
      notes,
      materials: [],
    });
    toast.success(initialStatus === "pending" ? "Request created!" : "Job scheduled!");
    setClientId(""); setService(""); setAmount(""); setNotes(""); setLocation("");
    setOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>New Request</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="h-11 rounded-xl text-sm flex-1"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <AddClientSheet
              trigger={<Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0"><Plus className="h-4 w-4" /></Button>}
              onClientAdded={handleClientAdded}
            />
          </div>

          <Select value={service} onValueChange={handleServiceChange}>
            <SelectTrigger className="h-11 rounded-xl text-sm"><SelectValue placeholder="Select service" /></SelectTrigger>
            <SelectContent>
              {userServices.length === 0 ? (
                <SelectItem value="" disabled>No services added. Add services in Service Catalog.</SelectItem>
              ) : (
                userServices.map((s, idx) => (
                  <SelectItem key={idx} value={s.name}>
                    {s.name} — ₹{s.price.toLocaleString()} {s.category && `(${s.category})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-11 rounded-xl text-sm flex-1" />
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="h-11 rounded-xl text-sm w-28" />
          </div>

          <Input placeholder="Location" value={location || selectedClient?.location || ""} onChange={e => setLocation(e.target.value)} className="h-11 rounded-xl text-sm" />
          <Input placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} className="h-11 rounded-xl text-sm" type="number" />
          <Textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="rounded-xl text-sm" rows={2} />

          <Button onClick={handleSave} className="w-full h-12 rounded-xl text-sm font-bold gradient-primary shadow-glow border-0">
            Create Request
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddJobSheet;
