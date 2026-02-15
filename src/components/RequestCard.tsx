import { Job } from "@/data/types";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, MessageSquare, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: Job;
  onClick?: () => void;
  onAccept?: (e?: React.MouseEvent) => void;
  onReschedule?: (e?: React.MouseEvent) => void;
  onDecline?: (e?: React.MouseEvent) => void;
}

const RequestCard = ({ request, onClick, onAccept, onReschedule, onDecline }: RequestCardProps) => {
  const isPending = request.status === "pending";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 shadow-lg border-2 transition-all",
        isPending ? "border-primary/30 bg-primary/5" : "border-border/20",
        onClick && "cursor-pointer active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Client Avatar */}
        <div className="h-14 w-14 rounded-2xl gradient-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-md shrink-0">
          {request.clientName.charAt(0)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="font-bold text-base text-foreground truncate">{request.clientName}</p>
            <StatusBadge status={request.status} />
          </div>

          <p className="text-sm text-muted-foreground font-medium mb-2">{request.service}</p>

          {/* Request Details */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Preferred: {request.date} at {request.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{request.location}</span>
            </div>
            {request.notes && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span className="italic">"{request.notes}"</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ₹{request.amount.toLocaleString()}
            </span>
          </div>

          {/* Quick Actions - Only for pending requests */}
          {isPending && (
            <div className="flex gap-2 pt-3 border-t border-border/30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept?.();
                }}
                className="flex-1 h-10 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReschedule?.();
                }}
                className="flex-1 h-10 rounded-xl border-2 border-primary/50 bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Calendar className="h-4 w-4" />
                Reschedule
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDecline?.();
                }}
                className="h-10 w-10 rounded-xl border-2 border-destructive/50 bg-destructive/10 text-destructive flex items-center justify-center active:scale-95 transition-all"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
