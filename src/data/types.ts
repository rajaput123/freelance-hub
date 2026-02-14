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
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  amount: number;
  paidAmount: number;
  notes: string;
  materials: Material[];
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

export type JobStatus = Job["status"];
export type EventStatus = FreelancerEvent["status"];
export type PaymentMethod = Payment["method"];
