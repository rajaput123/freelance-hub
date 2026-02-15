export interface Client {
  id: string;
  name: string;
  phone: string;
  location: string;
  notes: string;
  createdAt: string;
  totalJobs: number;
  totalSpent: number;
}

export interface Material {
  name: string;
  qty: number;
  cost: number;
}

export interface Job {
  id: string;
  clientId: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  status: "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";
  amount: number;
  paidAmount: number;
  notes: string;
  materials: Material[];
  expenses: number;
  convertedToEventId?: string;
}

export interface EventTask {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
}

export interface FreelancerEvent {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  date: string;
  endDate: string;
  location: string;
  budget: number;
  status: "planning" | "in_progress" | "completed";
  tasks: EventTask[];
  materials: Material[];
  expenses: number;
  totalPaid: number;
  helpers: string[];
  suppliers?: string[]; // Supplier contacts/vendors
  notes?: string;
  convertedFromJobId?: string;
}

export interface Payment {
  id: string;
  jobId?: string;
  eventId?: string;
  clientName: string;
  amount: number;
  method: "cash" | "upi" | "bank";
  date: string;
  type: "full" | "partial";
}

export interface Service {
  id: string;
  name: string;
  category: string;
  defaultRate: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  costPerUnit: number;
  minStock: number;
}

export interface Message {
  id: string;
  type: "reminder" | "update" | "announcement";
  title: string;
  body: string;
  recipientName: string;
  recipientId?: string;
  jobId?: string;
  eventId?: string;
  date: string;
  read: boolean;
}

export type JobStatus = Job["status"];
export type EventStatus = FreelancerEvent["status"];
export type PaymentMethod = Payment["method"];
