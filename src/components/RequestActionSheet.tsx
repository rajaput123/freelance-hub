import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Job } from "@/data/types";
import { CheckCircle2, Calendar, XCircle, Clock, MapPin, MessageSquare } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { toast } from "sonner";

interface RequestActionSheetProps {
  request: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule?: () => void;
}

const RequestActionSheet = ({ request, open, onOpenChange, onReschedule }: RequestActionSheetProps) => {
  const { updateJobStatus } = useAppData();

  if (!request) return null;

  const handleAccept = () => {
    updateJobStatus(request.id, "scheduled");
    toast.success("Request accepted! Booking created.");
    onOpenChange(false);
  };

  const handleDecline = () => {
    updateJobStatus(request.id, "cancelled");
    toast.success("Request declined.");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto border-0 bg-background">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Review Request
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Request Details */}
          <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-md">
                {request.clientName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-base">{request.clientName}</p>
                <p className="text-sm text-muted-foreground">{request.service}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{request.date} at {request.time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{request.location}</span>
              </div>
              {request.notes && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                  <span className="italic">"{request.notes}"</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ₹{request.amount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <Button
              onClick={handleAccept}
              className="w-full h-12 rounded-2xl gap-2 text-sm font-bold gradient-primary shadow-glow border-0"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept & Create Booking
            </Button>

            <Button
              onClick={onReschedule}
              variant="outline"
              className="w-full h-12 rounded-2xl gap-2 text-sm font-bold border-2"
            >
              <Calendar className="h-4 w-4" />
              Reschedule Time
            </Button>

            <Button
              onClick={handleDecline}
              variant="outline"
              className="w-full h-12 rounded-2xl gap-2 text-sm font-bold border-2 border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-4 w-4" />
              Decline Request
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RequestActionSheet;
