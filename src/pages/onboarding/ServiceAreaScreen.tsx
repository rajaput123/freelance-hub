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

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Other"
];

const countries = ["India", "Other"];

const ServiceAreaScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [addressLine, setAddressLine] = useState(user?.addressLine || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [country, setCountry] = useState(user?.country || "India");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      updateUser({ 
        addressLine: addressLine || undefined,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
        pincode: pincode || undefined,
      });
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
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Address Line
              </label>
              <textarea
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Enter address"
                rows={3}
                className="w-full bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 py-3 text-base font-medium shadow-sm resize-none"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City
              </label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary text-base font-medium shadow-sm">
                  <SelectValue placeholder="Select city" />
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
                State
              </label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary text-base font-medium shadow-sm">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((stateName) => (
                    <SelectItem key={stateName} value={stateName}>
                      {stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Country
              </label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary text-base font-medium shadow-sm">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((countryName) => (
                    <SelectItem key={countryName} value={countryName}>
                      {countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                maxLength={6}
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

export default ServiceAreaScreen;
