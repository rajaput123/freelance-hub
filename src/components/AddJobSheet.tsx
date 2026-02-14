import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { services } from "@/data/mockData";
import { toast } from "sonner";
import AddClientSheet from "./AddClientSheet";

interface AddJobSheetProps {
  trigger?: React.ReactNode;
}

const AddJobSheet = ({ trigger }: AddJobSheetProps) => {
  const { clients, addJob } = useAppData();
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const selectedClient = clients.find(c => c.id === clientId);
  const selectedService = services.find(s => s.name === service);

  const handleClientAdded = (newClientId: string) => {
    setClientId(newClientId);
  };

  const handleServiceChange = (val: string) => {
    setService(val);
    const svc = services.find(s => s.name === val);
    if (svc && !amount) setAmount(String(svc.defaultRate));
  };

  const handleSave = () => {
    if (!clientId || !service || !date) {
      toast.error("Client, service, and date are required");
      return;
    }
    const client = clients.find(c => c.id === clientId);
    addJob({
      clientId,
      clientName: client?.name || "",
      service,
      date,
      time,
      location: location || client?.location || "",
      status: "scheduled",
      amount: Number(amount) || selectedService?.defaultRate || 0,
      paidAmount: 0,
      notes,
      materials: [],
    });
    toast.success("Job created!");
    setClientId(""); setService(""); setAmount(""); setNotes(""); setLocation("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2 rounded-lg">
            <Plus className="h-5 w-5" /> New Job
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-base">New Job</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="h-10 rounded-lg text-sm flex-1">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddClientSheet
              trigger={<Button variant="outline" size="icon" className="h-10 w-10 rounded-lg shrink-0"><Plus className="h-4 w-4" /></Button>}
              onClientAdded={handleClientAdded}
            />
          </div>

          <Select value={service} onValueChange={handleServiceChange}>
            <SelectTrigger className="h-10 rounded-lg text-sm">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map(s => (
                <SelectItem key={s.id} value={s.name}>{s.name} — ₹{s.defaultRate}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-10 rounded-lg text-sm flex-1" />
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="h-10 rounded-lg text-sm w-28" />
          </div>

          <Input
            placeholder="Location"
            value={location || selectedClient?.location || ""}
            onChange={e => setLocation(e.target.value)}
            className="h-10 rounded-lg text-sm"
          />

          <Input
            placeholder="Amount (₹)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="h-10 rounded-lg text-sm"
            type="number"
          />

          <Textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="rounded-lg text-sm" rows={2} />

          <Button onClick={handleSave} className="w-full h-10 rounded-lg text-sm font-semibold">
            Create Job
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddJobSheet;
