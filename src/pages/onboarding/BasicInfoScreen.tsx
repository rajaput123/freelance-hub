import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2 } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { toast } from "sonner";

const BasicInfoScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuth();
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [contactPersonName, setContactPersonName] = useState(user?.contactPersonName || "");
  const [mobile, setMobile] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || "");
  const [panNumber, setPanNumber] = useState(user?.panNumber || "");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if onboarding is already complete
  useEffect(() => {
    if (isAuthenticated && user?.onboardingComplete) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      updateUser({ 
        businessName: businessName || undefined,
        contactPersonName: contactPersonName || undefined,
        phone: mobile || undefined,
        email: email || undefined,
        gstNumber: gstNumber || undefined,
        panNumber: panNumber || undefined,
      });
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
                Business Name / Freelancer Name <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter business name (optional)"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Contact Person Name <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="text"
                value={contactPersonName}
                onChange={(e) => setContactPersonName(e.target.value)}
                placeholder="Enter contact name (optional)"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Mobile <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 XXXXX XXXXX (optional)"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                GST Number <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="Optional"
                className="w-full h-14 bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-base font-medium shadow-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                PAN Number <span className="text-xs text-muted-foreground">(Optional)</span>
              </label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="Optional"
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
