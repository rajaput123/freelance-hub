import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, ShoppingBag, Plus, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Service {
  name: string;
  price: number;
  duration: string;
  category?: string;
}

const ServiceCatalogPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [services, setServices] = useState<Service[]>(user?.services || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1 hour");
  const [category, setCategory] = useState("General");

  const durationOptions = ["30 min", "1 hour", "2 hours", "3 hours", "4+ hours"];
  const categoryOptions = ["General", "Electrical", "Plumbing", "Decoration", "Flowers", "Catering", "Photography", "Planning", "Technical", "Media", "Food", "Other"];

  const handleAddService = () => {
    if (!serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }

    const newService: Service = {
      name: serviceName.trim(),
      price: parseFloat(price) || 0,
      duration: duration || "1 hour",
      category: category || "General",
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    updateUser({ services: updatedServices });
    toast.success("Service added!");
    
    setServiceName("");
    setPrice("");
    setDuration("1 hour");
    setCategory("General");
    setShowAddForm(false);
  };

  const handleEditService = (index: number) => {
    const service = services[index];
    setEditingIndex(index);
    setServiceName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration);
    setCategory(service.category || "General");
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !serviceName.trim()) {
      toast.error("Service name is required");
      return;
    }

    const updatedServices = [...services];
    updatedServices[editingIndex] = {
      name: serviceName.trim(),
      price: parseFloat(price) || 0,
      duration: duration || "1 hour",
      category: category || "General",
    };

    setServices(updatedServices);
    updateUser({ services: updatedServices });
    toast.success("Service updated!");
    
    setEditingIndex(null);
    setServiceName("");
    setPrice("");
    setDuration("1 hour");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setServiceName("");
    setPrice("");
    setDuration("1 hour");
  };

  const handleDeleteService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
    updateUser({ services: updatedServices });
    toast.success("Service deleted!");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 glass px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              My Services
            </h1>
          </div>
          {!showAddForm && editingIndex === null && (
            <button
              onClick={() => setShowAddForm(true)}
              className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow active:scale-95 transition-transform"
            >
              <Plus className="h-4 w-4 text-primary-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-border/20 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground">Add New Service</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setServiceName("");
                  setPrice("");
                  setDuration("1 hour");
                  setCategory("General");
                }}
                className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Service Name *
              </label>
              <Input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., AC Repair, Plumbing Fix"
                className="h-11 rounded-xl text-sm"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="h-11 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Duration
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-11 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAddService}
              className="w-full h-11 rounded-xl text-sm font-bold gradient-primary shadow-glow border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="px-4 mt-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-border/20">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">No services added</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add your services to start receiving bookings
            </p>
            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="h-10 rounded-xl text-xs font-bold gradient-primary shadow-glow border-0"
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                Add Your First Service
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {services.map((service, index) => {
              const isEditing = editingIndex === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "bg-white rounded-2xl p-4 shadow-lg border border-border/20",
                    isEditing && "border-primary/50"
                  )}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-foreground">Edit Service</h3>
                        <div className="flex gap-1.5">
                          <button
                            onClick={handleSaveEdit}
                            className="h-7 w-7 rounded-lg bg-success/10 text-success flex items-center justify-center active:scale-95"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="h-7 w-7 rounded-lg bg-muted text-muted-foreground flex items-center justify-center active:scale-95"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">
                          Service Name *
                        </label>
                        <Input
                          type="text"
                          value={serviceName}
                          onChange={(e) => setServiceName(e.target.value)}
                          className="h-10 rounded-xl text-sm"
                          autoFocus
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1.5 block">
                            Price (₹) *
                          </label>
                          <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                            className="h-10 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground mb-1.5 block">
                            Duration
                          </label>
                          <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger className="h-10 rounded-xl text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {durationOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1.5 block">
                          Category
                        </label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="h-10 rounded-xl text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-[18px] w-[18px] text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {service.duration} {service.category && `• ${service.category}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0 mr-2">
                        <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          ₹{service.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEditService(index)}
                          className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(index)}
                          className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center active:scale-95"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCatalogPage;
