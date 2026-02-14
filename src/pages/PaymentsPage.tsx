import { useAppData } from "@/context/AppContext";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Banknote, Smartphone, Building2 } from "lucide-react";
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
    <div className="min-h-screen pb-24">
      <div className="bg-primary px-5 pb-8 pt-12 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-primary-foreground">Earnings</h1>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary-foreground/15 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
              <TrendingUp className="h-4 w-4" /> Received
            </div>
            <p className="text-2xl font-bold text-primary-foreground mt-1">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-primary-foreground/15 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
              <Wallet className="h-4 w-4" /> Pending
            </div>
            <p className="text-2xl font-bold text-primary-foreground mt-1">₹{totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* By method */}
        <div className="mt-4 flex gap-3">
          {Object.entries(byMethod).map(([method, amount]) => {
            const Icon = methodIcons[method] || Banknote;
            return (
              <div key={method} className="flex-1 rounded-xl bg-primary-foreground/10 p-3 text-center backdrop-blur-sm">
                <Icon className="h-4 w-4 text-primary-foreground/70 mx-auto" />
                <p className="text-sm font-semibold text-primary-foreground mt-1">₹{amount.toLocaleString()}</p>
                <p className="text-xs text-primary-foreground/60 capitalize">{method}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-lg font-bold mb-3">Recent Transactions</h2>
        <div className="space-y-2">
          {payments.map(payment => {
            const Icon = methodIcons[payment.method] || Banknote;
            return (
              <div key={payment.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <ArrowDownLeft className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{payment.clientName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon className="h-3 w-3" />
                    {payment.method.toUpperCase()} · {payment.type === "partial" ? "Partial" : "Full"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">+₹{payment.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{payment.date}</p>
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
