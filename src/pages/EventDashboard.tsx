import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppData } from "@/context/AppContext";
import { ArrowLeft, Plus, CheckCircle2, Package, Wallet, Receipt, StickyNote, TrendingUp, Calendar, MapPin, Users, UserPlus, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import MaterialSelector from "@/components/MaterialSelector";
import { Material } from "@/data/types";

const EventDashboard = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, updateEventStatus, toggleEventTask, addEventTask, addEventMaterial, addEventExpense, addPayment, updateEventBudget, updateEventNotes, addEventHelper, removeEventHelper, addEventSupplier, removeEventSupplier } = useAppData();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "materials" | "team" | "payments" | "expenses" | "notes">("overview");

  const event = events.find(e => e.id === eventId);
  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Event not found</p>
          <Button onClick={() => navigate("/more/events")} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const completedTasks = event.tasks.filter(t => t.completed).length;
  const progress = event.tasks.length > 0 ? (completedTasks / event.tasks.length) * 100 : 0;
  const profit = event.totalPaid - event.expenses;
  const remainingBudget = event.budget - event.expenses;

  // Task management
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Task title is required");
      return;
    }
    addEventTask(event.id, newTaskTitle.trim(), newTaskDeadline || event.date);
    setNewTaskTitle("");
    setNewTaskDeadline("");
    toast.success("Task added!");
  };

  // Material management - using MaterialSelector
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>(event.materials || []);

  const handleMaterialsChange = (materials: Material[]) => {
    setSelectedMaterials(materials);
    // Update event materials - add new materials or update quantities
    // Note: This is a simplified approach - in production, you'd want a bulk update function
    materials.forEach(mat => {
      const existing = event.materials.find(m => m.name === mat.name);
      if (!existing) {
        // New material - add it
        addEventMaterial(event.id, mat.name, mat.qty, mat.cost);
      } else if (existing.qty !== mat.qty) {
        // Quantity changed - add the difference (simplified approach)
        const qtyDiff = mat.qty - existing.qty;
        if (qtyDiff > 0) {
          const costPerUnit = mat.cost / mat.qty;
          addEventMaterial(event.id, mat.name, qtyDiff, costPerUnit * qtyDiff);
        }
      }
    });
  };

  // Expense management
  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const handleAddExpense = () => {
    if (!newExpenseDesc.trim() || !newExpenseAmount) {
      toast.error("Description and amount required");
      return;
    }
    addEventExpense(event.id, newExpenseDesc.trim(), Number(newExpenseAmount));
    setNewExpenseDesc("");
    setNewExpenseAmount("");
    toast.success("Expense added!");
  };

  // Payment management
  const [newPayAmount, setNewPayAmount] = useState("");
  const [newPayMethod, setNewPayMethod] = useState<"cash" | "upi" | "bank">("cash");

  const handleAddPayment = () => {
    if (!newPayAmount) {
      toast.error("Amount required");
      return;
    }
    addPayment({
      eventId: event.id,
      clientName: event.clientName,
      amount: Number(newPayAmount),
      method: newPayMethod,
      date: new Date().toISOString().split("T")[0],
      type: "partial",
    });
    setNewPayAmount("");
    toast.success("Payment recorded!");
  };

  // Notes
  const [notes, setNotes] = useState(event.notes || "");
  const [showNotesEdit, setShowNotesEdit] = useState(false);

  const handleSaveNotes = () => {
    updateEventNotes(event.id, notes);
    setShowNotesEdit(false);
    toast.success("Notes saved!");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "tasks", label: "Tasks", icon: CheckCircle2 },
    { id: "materials", label: "Materials", icon: Package },
    { id: "team", label: "Team", icon: Users },
    { id: "payments", label: "Payments", icon: Wallet },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "notes", label: "Notes", icon: StickyNote },
  ];

  // Team management
  const [newHelper, setNewHelper] = useState("");
  const [newSupplier, setNewSupplier] = useState("");

  const handleAddHelper = () => {
    if (!newHelper.trim()) {
      toast.error("Helper name is required");
      return;
    }
    addEventHelper(event.id, newHelper.trim());
    setNewHelper("");
    toast.success("Helper added!");
  };

  const handleAddSupplier = () => {
    if (!newSupplier.trim()) {
      toast.error("Supplier name is required");
      return;
    }
    addEventSupplier(event.id, newSupplier.trim());
    setNewSupplier("");
    toast.success("Supplier added!");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 gradient-primary rounded-b-3xl shadow-lg">
        <div className="px-4 pt-4 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate("/more/events")}
              className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-primary-foreground truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {event.title}
              </h1>
              <p className="text-primary-foreground/80 text-xs">{event.clientName}</p>
            </div>
            <StatusBadge status={event.status} type="event" />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-white/10 text-primary-foreground/70"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4 space-y-4">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Event Info */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date} {event.endDate !== event.date && `- ${event.endDate}`}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                {(event.helpers && event.helpers.length > 0) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.helpers.join(", ")}</span>
                  </div>
                )}
                {(event.suppliers && event.suppliers.length > 0) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Suppliers: {event.suppliers.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Progress</span>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{completedTasks} of {event.tasks.length} tasks completed</p>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3">Financial Summary</h3>
              <div className="space-y-2">
                {[
                  { label: "Budget", value: event.budget, color: "" },
                  { label: "Received", value: event.totalPaid, color: "text-success" },
                  { label: "Expenses", value: event.expenses, color: "text-destructive" },
                  { label: "Profit", value: profit, color: profit >= 0 ? "text-success" : "text-destructive" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className={cn("text-sm font-bold", item.color)} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ₹{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {event.status !== "completed" && (
              <Button
                onClick={() => {
                  const next = event.status === "planning" ? "in_progress" : "completed";
                  updateEventStatus(event.id, next);
                  toast.success(next === "in_progress" ? "Event started!" : "Event completed!");
                }}
                className="w-full h-12 rounded-2xl text-sm font-bold gradient-primary shadow-glow border-0"
              >
                {event.status === "planning" ? "Start Event" : "Mark Complete"}
              </Button>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {/* Add Task Form */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3">Add New Task</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Task title *"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
                <Input
                  type="date"
                  placeholder="Deadline"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  min={event.date}
                  className="h-10 rounded-xl text-sm"
                />
                <Button onClick={handleAddTask} className="w-full h-10 rounded-xl text-sm font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {event.tasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-border/20">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                </div>
              ) : (
                event.tasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleEventTask(event.id, task.id)}
                        className="h-5 w-5 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold", task.completed && "line-through text-muted-foreground")}>
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Due: {task.deadline}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-4">
            {/* Helpers Section */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members / Helpers
              </h3>
              <div className="space-y-2 mb-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add helper name (e.g., Suresh - Electrician)"
                    value={newHelper}
                    onChange={(e) => setNewHelper(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddHelper()}
                    className="h-10 rounded-xl text-sm flex-1"
                  />
                  <Button onClick={handleAddHelper} className="h-10 px-4 rounded-xl text-sm font-bold">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              {(event.helpers && event.helpers.length > 0) ? (
                <div className="space-y-2">
                  {event.helpers.map((helper, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 rounded-xl p-2.5">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{helper}</span>
                      </div>
                      <button
                        onClick={() => {
                          removeEventHelper(event.id, helper);
                          toast.success("Helper removed");
                        }}
                        className="h-7 w-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-95"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No helpers added yet</p>
              )}
            </div>

            {/* Suppliers Section */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Suppliers / Vendors
              </h3>
              <div className="space-y-2 mb-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add supplier name (e.g., ABC Flowers, XYZ Lighting)"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSupplier()}
                    className="h-10 rounded-xl text-sm flex-1"
                  />
                  <Button onClick={handleAddSupplier} className="h-10 px-4 rounded-xl text-sm font-bold">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              {(event.suppliers && event.suppliers.length > 0) ? (
                <div className="space-y-2">
                  {event.suppliers.map((supplier, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 rounded-xl p-2.5">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{supplier}</span>
                      </div>
                      <button
                        onClick={() => {
                          removeEventSupplier(event.id, supplier);
                          toast.success("Supplier removed");
                        }}
                        className="h-7 w-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-95"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">No suppliers added yet</p>
              )}
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3">Client</h3>
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-2.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{event.clientName}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Client contact information is available in Clients section</p>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === "materials" && (
          <div className="space-y-4">
            <MaterialSelector
              selectedMaterials={selectedMaterials}
              onMaterialsChange={handleMaterialsChange}
              eventId={event.id}
            />

            {/* Materials Summary */}
            {selectedMaterials.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
                <h3 className="text-sm font-bold text-foreground mb-3">Materials Summary</h3>
                <div className="space-y-2">
                  {selectedMaterials.map((mat, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <p className="text-xs font-semibold">{mat.name}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {mat.qty}</p>
                      </div>
                      <p className="text-xs font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        ₹{mat.cost.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t-2 border-border">
                    <p className="text-sm font-bold text-foreground">Total Cost</p>
                    <p className="text-base font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      ₹{selectedMaterials.reduce((sum, m) => sum + m.cost, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            {/* Add Payment Form */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3">Record Payment</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Amount (₹) *"
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(e.target.value)}
                  type="number"
                  className="h-10 rounded-xl text-sm"
                />
                <Select value={newPayMethod} onValueChange={(v) => setNewPayMethod(v as typeof newPayMethod)}>
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleAddPayment} className="w-full h-10 rounded-xl text-sm font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Total Received</span>
                <span className="text-lg font-bold text-success" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{event.totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${event.budget > 0 ? (event.totalPaid / event.budget) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {event.budget > 0 ? `${Math.round((event.totalPaid / event.budget) * 100)}%` : "0%"} of budget received
              </p>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <div className="space-y-4">
            {/* Add Expense Form */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <h3 className="text-sm font-bold text-foreground mb-3">Add Expense</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Description *"
                  value={newExpenseDesc}
                  onChange={(e) => setNewExpenseDesc(e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
                <Input
                  placeholder="Amount (₹) *"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  type="number"
                  className="h-10 rounded-xl text-sm"
                />
                <Button onClick={handleAddExpense} className="w-full h-10 rounded-xl text-sm font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </div>

            {/* Expense Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Total Expenses</span>
                <span className="text-lg font-bold text-destructive" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ₹{event.expenses.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-destructive transition-all"
                  style={{ width: `${event.budget > 0 ? (event.expenses / event.budget) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {event.budget > 0 ? `${Math.round((event.expenses / event.budget) * 100)}%` : "0%"} of budget spent
              </p>
              {remainingBudget >= 0 ? (
                <p className="text-xs text-success mt-2 font-semibold">Remaining: ₹{remainingBudget.toLocaleString()}</p>
              ) : (
                <p className="text-xs text-destructive mt-2 font-semibold">Over budget by: ₹{Math.abs(remainingBudget).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20">
              {showNotesEdit ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this event..."
                    className="rounded-xl text-sm"
                    rows={6}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveNotes} className="flex-1 h-10 rounded-xl text-sm font-bold">
                      Save Notes
                    </Button>
                    <Button
                      onClick={() => setShowNotesEdit(false)}
                      variant="outline"
                      className="h-10 rounded-xl text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">Event Notes</h3>
                    <Button
                      onClick={() => setShowNotesEdit(true)}
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg text-xs"
                    >
                      Edit
                    </Button>
                  </div>
                  {notes ? (
                    <p className="text-sm text-foreground whitespace-pre-wrap">{notes}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No notes added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDashboard;
