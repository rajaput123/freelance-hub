import { useAppData } from "@/context/AppContext";
import { ArrowDownLeft, Wallet, TrendingUp, Banknote, Smartphone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen pb-28">
      <div className="gradient-header px-5 pb-10 pt-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)'}} />
        <div className="relative">
          <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">Earnings</h1>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" /> Received
              </div>
              <p className="text-2xl font-bold text-primary-foreground mt-1.5">₹{totalEarnings.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary-foreground/60 text-xs font-semibold uppercase tracking-wider">
                <Wallet className="h-3.5 w-3.5" /> Pending
              </div>
              <p className="text-2xl font-bold text-primary-foreground mt-1.5">₹{totalPending.toLocaleString()}</p>
            </div>
          </div>

          {/* By method */}
          <div className="mt-3 flex gap-2.5">
            {Object.entries(byMethod).map(([method, amount]) => {
              const Icon = methodIcons[method] || Banknote;
              return (
                <div key={method} className="flex-1 rounded-xl bg-primary-foreground/8 border border-primary-foreground/10 p-3 text-center backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-primary-foreground/60 mx-auto" />
                  <p className="text-sm font-bold text-primary-foreground mt-1.5">₹{amount.toLocaleString()}</p>
                  <p className="text-[11px] text-primary-foreground/50 capitalize font-medium">{method}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-base font-bold mb-3 tracking-tight">Recent Transactions</h2>
        <div className="space-y-2.5">
          {payments.map(payment => {
            const Icon = methodIcons[payment.method] || Banknote;
            return (
              <div key={payment.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <ArrowDownLeft className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{payment.clientName}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                    <Icon className="h-3 w-3" />
                    {payment.method.toUpperCase()} · {payment.type === "partial" ? "Partial" : "Full"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success text-sm">+₹{payment.amount.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{payment.date}</p>
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
