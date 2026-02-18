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
  onAccepted?: (jobId: string) => void;
}

const RequestActionSheet = ({ request, open, onOpenChange, onReschedule, onAccepted }: RequestActionSheetProps) => {
  const { updateJobStatus } = useAppData();

  const handleAccept = () => {
    if (!request) return;
    const jobId = request.id;
    updateJobStatus(jobId, "scheduled");
    toast.success("Request accepted & scheduled!");
    onOpenChange(false);
    // Notify parent that request was accepted - use setTimeout to ensure state updates complete first
    if (onAccepted) {
      setTimeout(() => {
        onAccepted(jobId);
      }, 50);
    }
  };

  const handleDecline = () => {
    if (!request) return;
    updateJobStatus(request.id, "cancelled");
    toast.success("Request declined.");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0 bg-background">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-5" />
        <SheetHeader>
          <SheetTitle className="text-left text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Review Request
          </SheetTitle>
        </SheetHeader>

        {request ? (
          <div className="mt-6 space-y-5">
            {/* Client Info Card - Enhanced */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-5 border-2 border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg">
                  {(request.clientName || request.freelancerName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-foreground">{request.clientName || request.freelancerName || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground font-medium">{request.service || request.taskName || "Service"}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-3">
                {request.date && (
                  <div className="flex items-center gap-3 bg-background/60 rounded-xl p-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Date & Time</p>
                      <p className="text-sm font-semibold text-foreground">{request.date}{request.time ? ` at ${request.time}` : ""}</p>
                    </div>
                  </div>
                )}
                {request.location && (
                  <div className="flex items-center gap-3 bg-background/60 rounded-xl p-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Location</p>
                      <p className="text-sm font-semibold text-foreground">{request.location}</p>
                    </div>
                  </div>
                )}
                {request.duration && (
                  <div className="flex items-center gap-3 bg-background/60 rounded-xl p-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium">Duration</p>
                      <p className="text-sm font-semibold text-foreground">{request.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {(request.notes || request.taskDescription) && (
                <div className="mt-3 bg-background/60 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Notes</p>
                      <p className="text-sm text-foreground italic">"{request.notes || request.taskDescription}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amount Card - Prominent */}
            <div className="gradient-primary rounded-3xl p-5 text-primary-foreground shadow-glow">
              <p className="text-xs uppercase tracking-wider opacity-90 font-semibold mb-2">Total Amount</p>
              <p className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ₹{(request.amount || 0).toLocaleString()}
              </p>
            </div>

            {/* Primary Action - Large & Prominent */}
            <Button
              onClick={handleAccept}
              className="w-full h-14 rounded-2xl gap-3 text-base font-bold gradient-primary shadow-glow border-0 hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 className="h-5 w-5" />
              Accept & Schedule
            </Button>

            {/* Secondary Actions */}
            <div className="space-y-2.5">
              <Button
                onClick={onReschedule}
                variant="outline"
                className="w-full h-12 rounded-2xl gap-2 text-sm font-semibold border-2 hover:bg-muted/50"
              >
                <Calendar className="h-4 w-4" />
                Reschedule Time
              </Button>

              <Button
                onClick={handleDecline}
                variant="outline"
                className="w-full h-12 rounded-2xl gap-2 text-sm font-semibold border-2 border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <XCircle className="h-4 w-4" />
                Decline Request
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center py-8">
            <p className="text-muted-foreground">No request selected</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RequestActionSheet;
