import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const workCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "Appliance Repair",
  "Other",
];

const BasicInfoScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [workCategory, setWorkCategory] = useState(user?.workCategory || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      updateUser({ name, workCategory, businessName: businessName || undefined });
      navigate("/onboarding/service-area");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressIndicator currentStep={1} totalSteps={6} stepLabels={["Basic", "Location", "Documents", "Profile", "Services", "MPIN"]} />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tell us about yourself
            </h1>
            <p className="text-sm text-muted-foreground">
              We'll use this information to personalize your experience
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Work Category
              </label>
              <Select value={workCategory} onValueChange={setWorkCategory}>
                <SelectTrigger className="h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary text-base font-medium shadow-sm">
                  <SelectValue placeholder="Select your work category" />
                </SelectTrigger>
                <SelectContent>
                  {workCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Business Name <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full gradient-primary h-14 rounded-2xl text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoScreen;
