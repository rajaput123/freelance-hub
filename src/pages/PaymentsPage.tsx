import { useAppData } from "@/context/AppContext";
import { ArrowDownLeft, Wallet, TrendingUp, Banknote, Smartphone, Building2, IndianRupee } from "lucide-react";

const methodIcons: Record<string, typeof Banknote> = {
  cash: Banknote,
  upi: Smartphone,
  bank: Building2,
};

const PaymentsPage = () => {
  const { payments, jobs, events } = useAppData();

  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);
  const totalPending = jobs.reduce((s, j) => s + Math.max(0, j.amount - j.paidAmount), 0)
    + events.reduce((s, e) => s + Math.max(0, e.budget - e.totalPaid), 0);

  const byMethod = payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="bg-primary px-5 pb-6 pt-11">
        <h1 className="text-xl font-bold text-primary-foreground">Earnings</h1>
      </div>

      {/* Summary cards */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-card p-4 shadow-sm border border-border/50">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5 text-success" /> Received
            </div>
            <p className="text-xl font-extrabold text-success mt-1">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm border border-border/50">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
              <Wallet className="h-3.5 w-3.5 text-warning" /> Pending
            </div>
            <p className="text-xl font-extrabold text-warning mt-1">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* Method breakdown */}
        <div className="flex gap-2 mt-3">
          {Object.entries(byMethod).map(([method, amount]) => {
            const Icon = methodIcons[method] || Banknote;
            return (
              <div key={method} className="flex-1 rounded-2xl bg-card border border-border/50 p-3 text-center shadow-sm">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[13px] font-bold mt-1.5">₹{amount.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground capitalize font-medium">{method}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="text-[14px] font-bold mb-3 px-1">Recent Transactions</h2>
        <div className="space-y-2">
          {payments.map(payment => {
            const Icon = methodIcons[payment.method] || Banknote;
            return (
              <div key={payment.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border/50 p-3.5 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-success/8 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] truncate">{payment.clientName}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Icon className="h-3 w-3" />
                    {payment.method.toUpperCase()} · {payment.type === "partial" ? "Partial" : "Full"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-success text-[14px]">+₹{payment.amount.toLocaleString()}</p>
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
