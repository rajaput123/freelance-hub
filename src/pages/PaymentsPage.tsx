import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { ArrowDownLeft, ArrowLeft, Wallet, TrendingUp, Banknote, Smartphone, Building2 } from "lucide-react";

const methodIcons: Record<string, typeof Banknote> = { cash: Banknote, upi: Smartphone, bank: Building2 };

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
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Finance</h1>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex gap-2.5">
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-soft">
            <div className="flex items-center gap-1.5 text-[10px] text-success font-bold uppercase tracking-wider">
              <TrendingUp className="h-3 w-3" /> Received
            </div>
            <p className="text-xl font-bold text-success mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-3.5 shadow-soft">
            <div className="flex items-center gap-1.5 text-[10px] text-warning font-bold uppercase tracking-wider">
              <Wallet className="h-3 w-3" /> Pending
            </div>
            <p className="text-xl font-bold text-warning mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2.5">
          {Object.entries(byMethod).map(([method, amount]) => {
            const Icon = methodIcons[method] || Banknote;
            return (
              <div key={method} className="bg-card rounded-2xl p-3 text-center shadow-soft">
                <Icon className="h-4 w-4 text-muted-foreground mx-auto" />
                <p className="text-sm font-bold mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>₹{amount.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground capitalize font-medium">{method}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-5">
        <h2 className="text-sm font-bold mb-3">Recent Transactions</h2>
        <div className="space-y-2.5">
          {payments.map(payment => {
            const Icon = methodIcons[payment.method] || Banknote;
            return (
              <div key={payment.id} className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-soft">
                <div className="h-10 w-10 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="h-[18px] w-[18px] text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{payment.clientName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                    <Icon className="h-3 w-3" /> {payment.method.toUpperCase()} · {payment.type === "partial" ? "Partial" : "Full"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-success" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+₹{payment.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{payment.date}</p>
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
