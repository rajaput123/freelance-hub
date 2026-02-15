import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2, Plus, X, Check } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { toast } from "sonner";

interface Service {
  name: string;
  price: number;
  duration: string;
  category?: string;
}

const ServiceSetupScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [services, setServices] = useState<Service[]>(user?.services || []);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = ["30 min", "1 hour", "2 hours", "3 hours", "4+ hours"];
  const categoryOptions = ["General", "Electrical", "Plumbing", "Decoration", "Flowers", "Catering", "Photography", "Planning", "Technical", "Media", "Food", "Other"];

  const addService = () => {
    const newService: Service = {
      name: serviceName.trim() || "Untitled Service",
      price: parseFloat(price) || 0,
      duration: duration || "1 hour",
      category: category || "General",
    };

    setServices([...services, newService]);
    setServiceName("");
    setPrice("");
    setDuration("");
    setCategory("");
    toast.success("Service added!");
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      updateUser({ services });
      navigate("/onboarding/mpin");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressIndicator currentStep={5} totalSteps={6} stepLabels={["Basic", "Location", "Documents", "Profile", "Services", "MPIN"]} />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Add Your Services
            </h1>
            <p className="text-sm text-muted-foreground">
              Set up your service offerings and pricing
            </p>
          </div>

          {/* Add Service Form */}
          <div className="bg-white rounded-2xl p-5 border-2 border-border/30 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Add New Service</h3>
            
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Service Name
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="e.g., AC Repair, Plumbing Fix"
                className="w-full h-12 bg-background rounded-xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full h-12 bg-background rounded-xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-12 bg-background rounded-xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-sm font-medium"
                >
                  <option value="">Select</option>
                  {durationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 bg-background rounded-xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-sm font-medium"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addService}
              className="w-full h-12 rounded-xl border-2 border-primary/50 bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>

          {/* Services List */}
          {services.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Your Services</h3>
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 border-2 border-border/30 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm mb-1">{service.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>₹{service.price.toLocaleString()}</span>
                      <span>•</span>
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeService(index)}
                    className="h-8 w-8 rounded-lg bg-muted hover:bg-destructive/10 flex items-center justify-center shrink-0 transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full gradient-primary h-14 rounded-2xl text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Completing Setup...
              </>
            ) : (
              <>
                Complete Setup
                <Check className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSetupScreen;
