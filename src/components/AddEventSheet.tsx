import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/context/AppContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import AddClientSheet from "./AddClientSheet";

interface AddEventSheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddEventSheet = ({ trigger, open: controlledOpen, onOpenChange }: AddEventSheetProps) => {
  const { clients, addEvent } = useAppData();
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleClientAdded = (newClientId: string) => {
    setClientId(newClientId);
  };

  const handleSave = () => {
    if (!title.trim() || !clientId || !date) {
      toast.error("Title, client, and date are required");
      return;
    }
    const client = clients.find(c => c.id === clientId);
    const newEvent = addEvent({
      title: title.trim(),
      clientId,
      clientName: client?.name || "",
      date,
      endDate: endDate || date,
      location: location.trim() || client?.location || "",
      budget: Number(budget) || 0,
      status: "planning",
      tasks: [],
      materials: [],
      expenses: 0,
      totalPaid: 0,
      helpers: [],
      suppliers: [],
    });
    toast.success("Event created!");
    setTitle("");
    setClientId("");
    setLocation("");
    setBudget("");
    setOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Create New Event / Project
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <Input
            placeholder="Event Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 rounded-xl text-sm"
            autoFocus
          />

          <div className="flex gap-2">
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="h-11 rounded-xl text-sm flex-1">
                <SelectValue placeholder="Select client *" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddClientSheet
              trigger={
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              }
              onClientAdded={handleClientAdded}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Start Date *</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-xl text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={date}
                className="h-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 rounded-xl text-sm"
          />

          <Input
            placeholder="Estimated Budget (₹)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            type="number"
            className="h-11 rounded-xl text-sm"
          />

          <Button onClick={handleSave} className="w-full h-12 rounded-xl text-sm font-bold gradient-primary shadow-glow border-0">
            Create Event
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEventSheet;
