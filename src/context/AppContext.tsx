import React, { createContext, useContext, useState, useCallback } from "react";
import { Client, Job, FreelancerEvent, Payment, InventoryItem, Message } from "@/data/types";
import {
  clients as mockClients,
  jobs as mockJobs,
  events as mockEvents,
  payments as mockPayments,
  inventoryItems as mockInventory,
  messages as mockMessages,
} from "@/data/mockData";

interface AppContextType {
  clients: Client[];
  jobs: Job[];
  events: FreelancerEvent[];
  payments: Payment[];
  inventory: InventoryItem[];
  messages: Message[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "totalJobs" | "totalSpent">) => Client;
  addJob: (job: Omit<Job, "id">) => void;
  updateJobStatus: (jobId: string, status: Job["status"]) => void;
  updateJobNotes: (jobId: string, notes: string) => void;
  addJobMaterials: (jobId: string, materials: Job["materials"]) => void;
  addJobExpense: (jobId: string, description: string, amount: number) => void;
  addPayment: (payment: Omit<Payment, "id">) => void;
  addEvent: (event: Omit<FreelancerEvent, "id">) => FreelancerEvent;
  updateEventStatus: (eventId: string, status: FreelancerEvent["status"]) => void;
  toggleEventTask: (eventId: string, taskId: string) => void;
  addEventTask: (eventId: string, title: string, deadline: string) => void;
  addEventMaterial: (eventId: string, name: string, qty: number, cost: number) => void;
  addEventExpense: (eventId: string, description: string, amount: number) => void;
  updateEventBudget: (eventId: string, budget: number) => void;
  updateEventNotes: (eventId: string, notes: string) => void;
  addEventHelper: (eventId: string, helperName: string) => void;
  removeEventHelper: (eventId: string, helperName: string) => void;
  addEventSupplier: (eventId: string, supplierName: string) => void;
  removeEventSupplier: (eventId: string, supplierName: string) => void;
  convertJobToEvent: (jobId: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  updateInventoryStock: (itemId: string, delta: number) => void;
  addMessage: (msg: Omit<Message, "id">) => void;
  markMessageRead: (msgId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used within AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [events, setEvents] = useState<FreelancerEvent[]>(mockEvents);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const addClient = useCallback((data: Omit<Client, "id" | "createdAt" | "totalJobs" | "totalSpent">) => {
    const newClient: Client = {
      ...data,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      totalJobs: 0,
      totalSpent: 0,
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  }, []);

  const addJob = useCallback((data: Omit<Job, "id">) => {
    const newJob: Job = { ...data, expenses: data.expenses || 0, id: `j${Date.now()}` };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const updateJobStatus = useCallback((jobId: string, status: Job["status"]) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  }, []);

  const updateJobSchedule = useCallback((jobId: string, date: string, time: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, date, time } : j));
  }, []);

  const updateJobNotes = useCallback((jobId: string, notes: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, notes } : j));
  }, []);

  const addJobMaterials = useCallback((jobId: string, materials: Job["materials"]) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, materials: [...j.materials, ...materials] } : j));
    // Auto-deduct from inventory
    materials.forEach(m => {
      setInventory(prev => prev.map(inv => {
        if (inv.name.toLowerCase().includes(m.name.toLowerCase())) {
          return { ...inv, stock: Math.max(0, inv.stock - m.qty) };
        }
        return inv;
      }));
    });
  }, []);

  const addJobExpense = useCallback((jobId: string, description: string, amount: number) => {
    setJobs(prev => prev.map(j =>
      j.id === jobId ? { ...j, expenses: (j.expenses || 0) + amount } : j
    ));
  }, []);

  const addPayment = useCallback((data: Omit<Payment, "id">) => {
    const newPayment: Payment = { ...data, id: `p${Date.now()}` };
    setPayments(prev => [newPayment, ...prev]);
    if (data.jobId) {
      setJobs(prev => prev.map(j => j.id === data.jobId ? { ...j, paidAmount: j.paidAmount + data.amount } : j));
    }
    if (data.eventId) {
      setEvents(prev => prev.map(e => e.id === data.eventId ? { ...e, totalPaid: e.totalPaid + data.amount } : e));
    }
  }, []);

  const addEvent = useCallback((data: Omit<FreelancerEvent, "id">) => {
    const newEvent: FreelancerEvent = { ...data, id: `e${Date.now()}` };
    setEvents(prev => [newEvent, ...prev]);
    return newEvent;
  }, []);

  const updateEventStatus = useCallback((eventId: string, status: FreelancerEvent["status"]) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status } : e));
  }, []);

  const toggleEventTask = useCallback((eventId: string, taskId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, tasks: e.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : e
    ));
  }, []);

  const addEventTask = useCallback((eventId: string, title: string, deadline: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, tasks: [...e.tasks, { id: `t${Date.now()}`, title, deadline, completed: false }] }
        : e
    ));
  }, []);

  const addEventMaterial = useCallback((eventId: string, name: string, qty: number, cost: number) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, materials: [...e.materials, { name, qty, cost }] }
        : e
    ));
    // Auto-deduct from inventory
    setInventory(prev => prev.map(inv => {
      if (inv.name.toLowerCase().includes(name.toLowerCase())) {
        return { ...inv, stock: Math.max(0, inv.stock - qty) };
      }
      return inv;
    }));
  }, []);

  const addEventExpense = useCallback((eventId: string, description: string, amount: number) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, expenses: e.expenses + amount }
        : e
    ));
  }, []);

  const updateEventBudget = useCallback((eventId: string, budget: number) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, budget } : e));
  }, []);

  const updateEventNotes = useCallback((eventId: string, notes: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, notes } : e));
  }, []);

  const addEventHelper = useCallback((eventId: string, helperName: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const helpers = e.helpers || [];
        if (!helpers.includes(helperName.trim())) {
          return { ...e, helpers: [...helpers, helperName.trim()] };
        }
      }
      return e;
    }));
  }, []);

  const removeEventHelper = useCallback((eventId: string, helperName: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, helpers: (e.helpers || []).filter(h => h !== helperName) } : e
    ));
  }, []);

  const addEventSupplier = useCallback((eventId: string, supplierName: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const suppliers = e.suppliers || [];
        if (!suppliers.includes(supplierName.trim())) {
          return { ...e, suppliers: [...suppliers, supplierName.trim()] };
        }
      }
      return e;
    }));
  }, []);

  const removeEventSupplier = useCallback((eventId: string, supplierName: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, suppliers: (e.suppliers || []).filter(s => s !== supplierName) } : e
    ));
  }, []);

  const convertJobToEvent = useCallback((jobId: string) => {
    setJobs(prev => {
      const job = prev.find(j => j.id === jobId);
      if (!job) return prev;

      const eventId = `e${Date.now()}`;
      const newEvent: FreelancerEvent = {
        id: eventId,
        title: `${job.service} - ${job.clientName}`,
        clientId: job.clientId,
        clientName: job.clientName,
        date: job.date,
        endDate: job.date,
        location: job.location,
        budget: job.amount,
        status: "planning",
        tasks: [{ id: `t${Date.now()}`, title: job.service, deadline: job.date, completed: false }],
        materials: [...job.materials],
        expenses: job.materials.reduce((s, m) => s + m.cost, 0),
        totalPaid: job.paidAmount,
        helpers: [],
        suppliers: [],
        convertedFromJobId: jobId,
      };
      setEvents(prevEvents => [newEvent, ...prevEvents]);

      return prev.map(j => j.id === jobId ? { ...j, status: "cancelled" as const, convertedToEventId: eventId } : j);
    });
  }, []);

  const addInventoryItem = useCallback((data: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = { ...data, id: `inv${Date.now()}` };
    setInventory(prev => [newItem, ...prev]);
  }, []);

  const updateInventoryStock = useCallback((itemId: string, delta: number) => {
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, stock: Math.max(0, i.stock + delta) } : i));
  }, []);

  const addMessage = useCallback((data: Omit<Message, "id">) => {
    const newMsg: Message = { ...data, id: `m${Date.now()}` };
    setMessages(prev => [newMsg, ...prev]);
  }, []);

  const markMessageRead = useCallback((msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m));
  }, []);

  return (
    <AppContext.Provider value={{
      clients, jobs, events, payments, inventory, messages,
      addClient, addJob, updateJobStatus, updateJobSchedule, updateJobNotes, addJobMaterials, addJobExpense,
      addPayment, addEvent, updateEventStatus, toggleEventTask, addEventTask,
      addEventMaterial, addEventExpense, updateEventBudget, updateEventNotes,
      addEventHelper, removeEventHelper, addEventSupplier, removeEventSupplier,
      convertJobToEvent, addInventoryItem, updateInventoryStock,
      addMessage, markMessageRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};
