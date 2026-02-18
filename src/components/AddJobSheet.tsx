import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import AddClientSheet from "./AddClientSheet";

interface AddJobSheetProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialStatus?: "pending" | "scheduled";
}

const AddJobSheet = ({ trigger, open: controlledOpen, onOpenChange, initialStatus = "pending" }: AddJobSheetProps) => {
  const { clients, addJob, events } = useAppData();
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"assignment" | "task">("assignment");
  
  // Assignment Details fields
  const [freelancerId, setFreelancerId] = useState("");
  const [eventId, setEventId] = useState("");
  const [linkedStructure, setLinkedStructure] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  
  // Task Details fields
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Mock freelancers list (in real app, this would come from API)
  const freelancers = [
    { id: "frl-1", name: "John Doe - Photographer" },
    { id: "frl-2", name: "Jane Smith - Videographer" },
    { id: "frl-3", name: "Mike Johnson - Decorator" },
  ];

  // Mock structures list (in real app, this would come from API)
  const structures = [
    { id: "str-1", name: "Main Temple" },
    { id: "str-2", name: "Reception Hall" },
    { id: "str-3", name: "Stage Area" },
    { id: "str-4", name: "Parking Area" },
  ];

  const selectedEvent = events.find(e => e.id === eventId);
  const selectedFreelancer = freelancers.find(f => f.id === freelancerId);

  const handleAmountChange = (value: string) => {
    const numValue = value.replace(/\D/g, "");
    setAmount(numValue);
  };

  const incrementAmount = () => {
    const current = Number(amount) || 0;
    setAmount(String(current + 1000));
  };

  const decrementAmount = () => {
    const current = Number(amount) || 0;
    if (current > 0) {
      setAmount(String(Math.max(0, current - 1000)));
    }
  };

  const handleSave = () => {
    if (!freelancerId || !linkedStructure || !date || !duration || !amount) {
      toast.error("Please fill all required fields");
      return;
    }

    // Auto-generate task name if empty
    const finalTaskName = taskName.trim() || 
      `Freelancer Assignment - ${selectedEvent ? selectedEvent.title : "Non-event assignment"}`;

    // Get client from event or use default
    const clientId = selectedEvent?.clientId || clients[0]?.id || "";
    const clientName = selectedEvent?.clientName || clients[0]?.name || selectedFreelancer?.name || "";

    addJob({
      clientId,
      clientName,
      service: finalTaskName,
      date,
      time: "10:00",
      location: selectedEvent?.location || "",
      status: initialStatus,
      amount: Number(amount),
      paidAmount: 0,
      notes: taskDescription || "",
      materials: [],
      // Assignment fields
      freelancerId,
      freelancerName: selectedFreelancer?.name,
      eventId: eventId || undefined,
      linkedStructure,
      duration,
      taskName: finalTaskName,
      taskDescription: taskDescription || undefined,
    });

    toast.success("Assignment created! Task will be auto-generated.");
    
    // Reset form
    setFreelancerId("");
    setEventId("");
    setLinkedStructure("");
    setDate(new Date().toISOString().split("T")[0]);
    setDuration("");
    setAmount("");
    setTaskName("");
    setTaskDescription("");
    setActiveTab("assignment");
    setOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Add Assignment
          </SheetTitle>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-border/50">
          <button
            onClick={() => setActiveTab("assignment")}
            className={cn(
              "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "assignment"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            )}
          >
            Assignment Details
          </button>
          <button
            onClick={() => setActiveTab("task")}
            className={cn(
              "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
              activeTab === "task"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            )}
          >
            Task Details
          </button>
        </div>

        {/* Assignment Details Tab */}
        {activeTab === "assignment" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Freelancer <span className="text-destructive">*</span>
              </label>
              <Select value={freelancerId} onValueChange={setFreelancerId}>
                <SelectTrigger className="h-12 rounded-xl text-sm">
                  <SelectValue placeholder="Select freelancer" />
                </SelectTrigger>
                <SelectContent>
                  {freelancers.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Event (from Event Module)
              </label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger className="h-12 rounded-xl text-sm">
                  <SelectValue placeholder="Non-event assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non-event assignment</SelectItem>
                  {events.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Linked Structure <span className="text-destructive">*</span>
              </label>
              <Select value={linkedStructure} onValueChange={setLinkedStructure}>
                <SelectTrigger className="h-12 rounded-xl text-sm">
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  {structures.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="h-12 rounded-xl text-sm"
                placeholder="dd / mm / yyyy"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Duration <span className="text-destructive">*</span>
              </label>
              <Input
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g., 2 days"
                className="h-12 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Agreed Payment (₹) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  value={amount ? `₹${Number(amount).toLocaleString()}` : ""}
                  onChange={e => handleAmountChange(e.target.value)}
                  placeholder="Enter amount"
                  className="h-12 rounded-xl text-sm pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={incrementAmount}
                    className="h-4 w-4 flex items-center justify-center hover:bg-muted rounded"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={decrementAmount}
                    className="h-4 w-4 flex items-center justify-center hover:bg-muted rounded"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Tab */}
        {activeTab === "task" && (
          <div className="mt-6 space-y-4">
            <div className="bg-info/10 border border-info/20 rounded-xl p-3 flex items-start gap-2">
              <Zap className="h-4 w-4 text-info mt-0.5 shrink-0" />
              <p className="text-xs text-info">
                A task will be auto-created in the Task module when this assignment is saved.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Task Name
              </label>
              <Input
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                placeholder="Enter task name (optional - auto-generated if empty)"
                className="h-12 rounded-xl text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                If empty, will use: "Freelancer Assignment - {selectedEvent?.title || "[Event Name]"}"
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Task Description / Notes
              </label>
              <Textarea
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                placeholder="Enter task description or notes (optional)"
                className="rounded-xl text-sm min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be added as notes in the auto-generated task
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 h-12 rounded-xl text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 h-12 rounded-xl text-sm font-semibold gradient-primary shadow-glow border-0"
          >
            Save Assignment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddJobSheet;
