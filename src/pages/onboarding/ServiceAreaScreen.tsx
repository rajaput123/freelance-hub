import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Other",
];

const ServiceAreaScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [city, setCity] = useState(user?.city || "");
  const [coverageArea, setCoverageArea] = useState(user?.coverageArea || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      updateUser({ city, coverageArea });
      navigate("/onboarding/documents");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressIndicator currentStep={2} totalSteps={6} stepLabels={["Basic", "Location", "Documents", "Profile", "Services", "MPIN"]} />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Where do you work?
            </h1>
            <p className="text-sm text-muted-foreground">
              Help clients find you in their area
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary text-base font-medium shadow-sm">
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((cityName) => (
                    <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Coverage Area
              </label>
              <input
                type="text"
                value={coverageArea}
                onChange={(e) => setCoverageArea(e.target.value)}
                placeholder="e.g., South Mumbai, Central Delhi"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Specify the areas or neighborhoods where you provide services
              </p>
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

export default ServiceAreaScreen;
