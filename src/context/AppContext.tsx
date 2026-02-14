import React, { createContext, useContext, useState, useCallback } from "react";
import { Client, Job, FreelancerEvent, Payment } from "@/data/types";
import { clients as mockClients, jobs as mockJobs, events as mockEvents, payments as mockPayments } from "@/data/mockData";

interface AppContextType {
  clients: Client[];
  jobs: Job[];
  events: FreelancerEvent[];
  payments: Payment[];
  addClient: (client: Omit<Client, "id" | "createdAt" | "totalJobs" | "totalSpent">) => Client;
  addJob: (job: Omit<Job, "id">) => void;
  updateJobStatus: (jobId: string, status: Job["status"]) => void;
  addPayment: (payment: Omit<Payment, "id">) => void;
  addEvent: (event: Omit<FreelancerEvent, "id">) => void;
  updateEventStatus: (eventId: string, status: FreelancerEvent["status"]) => void;
  toggleEventTask: (eventId: string, taskId: string) => void;
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
    const newJob: Job = { ...data, id: `j${Date.now()}` };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const updateJobStatus = useCallback((jobId: string, status: Job["status"]) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  }, []);

  const addPayment = useCallback((data: Omit<Payment, "id">) => {
    const newPayment: Payment = { ...data, id: `p${Date.now()}` };
    setPayments(prev => [newPayment, ...prev]);
    // Update paid amount on job
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

  return (
    <AppContext.Provider value={{
      clients, jobs, events, payments,
      addClient, addJob, updateJobStatus, addPayment,
      addEvent, updateEventStatus, toggleEventTask,
    }}>
      {children}
    </AppContext.Provider>
  );
};
