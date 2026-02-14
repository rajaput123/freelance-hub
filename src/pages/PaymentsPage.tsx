import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowLeft, Wallet, TrendingUp, Banknote, Smartphone, Building2 } from "lucide-react";

const methodIcons: Record<string, typeof Banknote> = {
  cash: Banknote,
  upi: Smartphone,
  bank: Building2,
};

const PaymentsPage = () => {
  const { payments, jobs, events } = useAppData();
  const navigate = useNavigate();

  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);
  const totalPending = jobs.reduce((s, j) => s + Math.max(0, j.amount - j.paidAmount), 0)
    + events.reduce((s, e) => s + Math.max(0, e.budget - e.totalPaid), 0);

  const byMethod = payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold">Finance & Accounts</h1>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 -mt-3">
        <div className="flex gap-2">
          <div className="flex-1 bg-card rounded-xl p-3 border border-border shadow-sm">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <TrendingUp className="h-3 w-3 text-success" /> Received
            </div>
            <p className="text-lg font-bold text-success mt-1">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-3 border border-border shadow-sm">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <Wallet className="h-3 w-3 text-warning" /> Pending
            </div>
            <p className="text-lg font-bold text-warning mt-1">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* Method breakdown */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {Object.entries(byMethod).map(([method, amount]) => {
            const Icon = methodIcons[method] || Banknote;
            return (
              <div key={method} className="flex-1 bg-card border border-border rounded-xl p-2.5 text-center shadow-sm">
                <Icon className="h-4 w-4 text-muted-foreground mx-auto" />
                <p className="text-sm font-bold mt-1">₹{amount.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{method}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4" />

      {/* Transactions */}
      <div className="px-4 mt-4">
        <h2 className="text-sm font-bold mb-3">Recent Transactions</h2>
        <div className="space-y-2">
          {payments.map(payment => {
            const Icon = methodIcons[payment.method] || Banknote;
            return (
              <div key={payment.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                <div className="h-9 w-9 rounded-full bg-success/8 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{payment.clientName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Icon className="h-3 w-3" />
                    {payment.method.toUpperCase()} · {payment.type === "partial" ? "Partial" : "Full"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-success">+₹{payment.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{payment.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
