import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { toast } from "sonner";

interface AddClientSheetProps {
  trigger?: React.ReactNode;
  onClientAdded?: (clientId: string) => void;
}

const AddClientSheet = ({ trigger, onClientAdded }: AddClientSheetProps) => {
  const { addClient } = useAppData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Client name is required");
      return;
    }
    const client = addClient({ name: name.trim(), phone: phone.trim(), location: location.trim(), notes: notes.trim() });
    toast.success(`${client.name} added!`);
    onClientAdded?.(client.id);
    setName(""); setPhone(""); setLocation(""); setNotes("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2 rounded-xl">
            <UserPlus className="h-5 w-5" />
            Add Client
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh]">
        <SheetHeader>
          <SheetTitle className="text-left text-lg">New Client</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <Input
            placeholder="Client name *"
            value={name}
            onChange={e => setName(e.target.value)}
            className="h-12 rounded-xl text-[14px]"
            autoFocus
          />
          <Input
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="h-12 rounded-xl text-[14px]"
            type="tel"
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="h-12 rounded-xl text-[14px]"
          />
          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="rounded-xl text-[14px]"
            rows={2}
          />
          <Button onClick={handleSave} className="w-full h-12 rounded-xl text-[14px] font-bold">
            Save Client
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddClientSheet;
