import { useAppData } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowDownLeft, ArrowLeft, Wallet, TrendingUp, Banknote, Smartphone, Building2, Plus, Receipt, AlertTriangle, Calendar, Filter, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Job, FreelancerEvent, Payment } from "@/data/types";
import PaymentRecordSheet from "@/components/PaymentRecordSheet";
import ExpenseRecordSheet from "@/components/ExpenseRecordSheet";

const methodIcons: Record<string, typeof Banknote> = { cash: Banknote, upi: Smartphone, bank: Building2 };

type TabType = "overview" | "pending" | "transactions" | "expenses";
type PeriodType = "today" | "week" | "month" | "all";

const PaymentsPage = () => {
  const { payments, jobs, events } = useAppData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [period, setPeriod] = useState<PeriodType>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<Job | FreelancerEvent | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Calculate totals
  const totalEarnings = payments.reduce((s, p) => s + p.amount, 0);
  const totalPending = jobs.reduce((s, j) => s + Math.max(0, j.amount - j.paidAmount), 0)
    + events.reduce((s, e) => s + Math.max(0, e.budget - e.totalPaid), 0);

  // Get pending items
  const pendingJobs = jobs.filter(j => j.status !== "cancelled" && j.paidAmount < j.amount);
  const pendingEvents = events.filter(e => e.status !== "completed" && e.totalPaid < e.budget);
  const allPending = [
    ...pendingJobs.map(j => ({ ...j, type: "job" as const, pending: j.amount - j.paidAmount })),
    ...pendingEvents.map(e => ({ ...e, type: "event" as const, pending: e.budget - e.totalPaid })),
  ].sort((a, b) => {
    const dateA = "date" in a ? a.date : a.date;
    const dateB = "date" in b ? b.date : b.date;
    return dateA.localeCompare(dateB);
  });

  // Get overdue items (past due date)
  const overdueItems = allPending.filter(item => {
    const itemDate = "date" in item ? item.date : item.date;
    return itemDate < today;
  });

  // Calculate expenses (from jobs and events)
  const totalExpenses = jobs.reduce((sum, j) => sum + (j.expenses || 0), 0) + events.reduce((sum, e) => sum + e.expenses, 0);
  const totalProfit = totalEarnings - totalExpenses;

  // Filter transactions by period
  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Period filter
    if (period !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (period === "today") {
        cutoff.setHours(0, 0, 0, 0);
      } else if (period === "week") {
        cutoff.setDate(now.getDate() - 7);
      } else if (period === "month") {
        cutoff.setMonth(now.getMonth() - 1);
      }
      filtered = filtered.filter(p => new Date(p.date) >= cutoff);
    }

    // Method filter
    if (filterMethod !== "all") {
      filtered = filtered.filter(p => p.method === filterMethod);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [payments, period, filterMethod, searchQuery]);

  // Calculate period earnings
  const periodEarnings = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  // Get expenses by period
  const periodExpenses = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (period === "today") {
      cutoff.setHours(0, 0, 0, 0);
    } else if (period === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (period === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    }

    const jobExpenses = jobs
      .filter(j => new Date(j.date) >= cutoff)
      .reduce((sum, j) => sum + (j.expenses || 0), 0);
    const eventExpenses = events
      .filter(e => new Date(e.date) >= cutoff)
      .reduce((sum, e) => sum + e.expenses, 0);
    return jobExpenses + eventExpenses;
  }, [jobs, events, period]);

  const byMethod = payments.reduce((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + p.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Finance
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowExpenseSheet(true);
                setSelectedItem(null);
              }}
              className="h-9 w-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center active:scale-95 transition-transform"
            >
              <Receipt className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setShowPaymentSheet(true);
                setSelectedItem(null);
              }}
              className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow active:scale-95 transition-transform"
            >
              <Plus className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-card rounded-2xl p-1 shadow-soft">
          {(["overview", "pending", "transactions", "expenses"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 rounded-xl py-2 text-xs font-bold transition-all capitalize",
                activeTab === tab ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="px-4 mt-4">
            <div className="flex gap-2.5 mb-2.5">
              <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
                <div className="flex items-center gap-1.5 text-[10px] text-success font-bold uppercase tracking-wider">
                  <TrendingUp className="h-3 w-3" /> Received
                </div>
                <p className="text-xl font-bold text-success mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
                <div className="flex items-center gap-1.5 text-[10px] text-warning font-bold uppercase tracking-wider">
                  <Wallet className="h-3 w-3" /> Pending
                </div>
                <p className="text-xl font-bold text-warning mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{totalPending.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
                <div className="flex items-center gap-1.5 text-[10px] text-destructive font-bold uppercase tracking-wider">
                  <Receipt className="h-3 w-3" /> Expenses
                </div>
                <p className="text-xl font-bold text-destructive mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="flex-1 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
                <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-wider">
                  <TrendingUp className="h-3 w-3" /> Profit
                </div>
                <p className="text-xl font-bold text-primary mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{totalProfit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Period Selector */}
            <div className="mt-3">
              <Select value={period} onValueChange={(v) => setPeriod(v as PeriodType)}>
                <SelectTrigger className="h-10 rounded-xl text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Period Summary */}
            {period !== "all" && (
              <div className="mt-3 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
                <p className="text-xs font-bold text-muted-foreground mb-2">
                  {period === "today" ? "Today" : period === "week" ? "This Week" : "This Month"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="text-sm font-bold text-success">₹{periodEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Expenses</span>
                  <span className="text-sm font-bold text-destructive">₹{periodExpenses.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <span className="text-sm font-bold">Net</span>
                  <span className="text-base font-bold text-primary">
                    ₹{(periodEarnings - periodExpenses).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="grid grid-cols-3 gap-2 mt-2.5">
              {Object.entries(byMethod).map(([method, amount]) => {
                const Icon = methodIcons[method] || Banknote;
                return (
                  <div key={method} className="bg-white rounded-2xl p-3 text-center shadow-lg border border-border/20">
                    <Icon className="h-4 w-4 text-muted-foreground mx-auto" />
                    <p className="text-sm font-bold mt-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ₹{amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize font-medium">{method}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Pending Dues Tab */}
      {activeTab === "pending" && (
        <div className="px-4 mt-4">
          {overdueItems.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-3.5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="text-xs font-bold text-destructive">Overdue Payments</p>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {overdueItems.length} item{overdueItems.length > 1 ? "s" : ""} with overdue payments
              </p>
            </div>
          )}

          {allPending.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
              <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">All payments received</p>
              <p className="text-xs text-muted-foreground mt-1">No pending dues</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {allPending.map((item) => {
                const isOverdue = overdueItems.includes(item);
                const itemDate = "date" in item ? item.date : item.date;
                const isJob = item.type === "job";
                const itemName = isJob ? (item as Job).service : (item as FreelancerEvent).title;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item as Job | FreelancerEvent);
                      setShowPaymentSheet(true);
                    }}
                    className={cn(
                      "bg-white rounded-2xl p-4 shadow-lg border-l-4 cursor-pointer active:scale-[0.98] transition-all",
                      isOverdue ? "border-destructive/50 bg-destructive/5" : "border-warning/50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm truncate">{item.clientName}</p>
                          {isOverdue && (
                            <span className="text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{itemName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Due: {itemDate} {isOverdue && "• Past due date"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-warning" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          ₹{item.pending.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">pending</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="px-4 mt-4">
          {/* Filters */}
          <div className="space-y-2 mb-4">
            <div className="relative">
              <Input
                placeholder="Search by client name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl text-sm pr-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="h-10 rounded-xl text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
              <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredPayments.map((payment) => {
                const Icon = methodIcons[payment.method] || Banknote;
                return (
                  <div key={payment.id} className="flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-lg border border-border/20">
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
                      <p className="text-sm font-bold text-success" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        +₹{payment.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">{payment.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-3.5 shadow-lg border border-border/20 mb-4">
            <p className="text-xs font-bold text-muted-foreground mb-2">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ₹{totalExpenses.toLocaleString()}
            </p>
          </div>

          {jobs.filter(j => (j.expenses || 0) > 0).length === 0 && events.filter(e => e.expenses > 0).length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
              <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No expenses recorded</p>
              <p className="text-xs text-muted-foreground mt-1">Add expenses for jobs or events</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Job Expenses */}
              {jobs
                .filter(j => (j.expenses || 0) > 0)
                .map((job) => {
                  const profit = job.paidAmount - (job.expenses || 0);
                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedItem(job);
                        setShowExpenseSheet(true);
                      }}
                      className="bg-white rounded-2xl p-4 shadow-lg border border-border/20 cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{job.service}</p>
                          <p className="text-xs text-muted-foreground">{job.clientName}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-bold">₹{job.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Expenses</span>
                          <span className="font-bold text-destructive">₹{(job.expenses || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Received</span>
                          <span className="font-bold text-success">₹{job.paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-1 border-t border-border/30">
                          <span className="font-bold">Profit</span>
                          <span className={cn(
                            "font-bold",
                            profit >= 0 ? "text-success" : "text-destructive"
                          )}>
                            ₹{profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {/* Event Expenses */}
              {events
                .filter(e => e.expenses > 0)
                .map((event) => {
                  const profit = event.totalPaid - event.expenses;
                  return (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="bg-white rounded-2xl p-4 shadow-lg border border-border/20 cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.clientName}</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="font-bold">₹{event.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Expenses</span>
                          <span className="font-bold text-destructive">₹{event.expenses.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Received</span>
                          <span className="font-bold text-success">₹{event.totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-1 border-t border-border/30">
                          <span className="font-bold">Profit</span>
                          <span className={cn(
                            "font-bold",
                            profit >= 0 ? "text-success" : "text-destructive"
                          )}>
                            ₹{profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Sheets */}
      <PaymentRecordSheet
        item={selectedItem}
        open={showPaymentSheet}
        onOpenChange={(open) => {
          setShowPaymentSheet(open);
          if (!open) setSelectedItem(null);
        }}
      />

      <ExpenseRecordSheet
        item={selectedItem}
        open={showExpenseSheet}
        onOpenChange={(open) => {
          setShowExpenseSheet(open);
          if (!open) setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default PaymentsPage;
