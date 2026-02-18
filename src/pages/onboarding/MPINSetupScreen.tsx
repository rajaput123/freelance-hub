import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const MPINSetupScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser, completeOnboarding, logout } = useAuth();
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleMpinComplete = (value: string) => {
    setMpin(value);
  };

  const handleConfirmMpinComplete = (value: string) => {
    setConfirmMpin(value);
  };

  const handleSubmit = async () => {
    if (mpin.length !== 4 || confirmMpin.length !== 4) {
      toast.error("Please enter both MPIN and confirm MPIN");
      return;
    }

    if (mpin !== confirmMpin) {
      toast.error("MPINs do not match. Please try again.");
      setMpin("");
      setConfirmMpin("");
      return;
    }

    setIsLoading(true);
    try {
      // Save MPIN and complete onboarding
      updateUser({ mpin });
      completeOnboarding();
      
      // Show thank you screen first
      setShowThankYou(true);
      setIsLoading(false);
      
      // Then clear session after showing thank you
      setTimeout(() => {
        // Clear user from context state but keep in localStorage
        const storedUser = localStorage.getItem("freelancer_user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Ensure onboardingComplete is true
          localStorage.setItem("freelancer_user", JSON.stringify({
            ...userData,
            onboardingComplete: true,
            mpin: mpin
          }));
        }
        // Clear from context (logout) - but keep thank you screen visible
        logout();
      }, 100);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // Auto-redirect to login after showing success message
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showThankYou, navigate]);

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
        <div className="max-w-lg w-full mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Registration Successful!
            </h1>
            <p className="text-base text-muted-foreground">
              Your registration is complete. Please login to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressIndicator currentStep={6} totalSteps={6} stepLabels={["Basic", "Location", "Documents", "Profile", "Services", "MPIN"]} />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Set Your MPIN
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a 4-digit MPIN for quick and secure login
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                Enter MPIN
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={mpin}
                  onChange={setMpin}
                  onComplete={handleMpinComplete}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                    <InputOTPSlot index={1} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                    <InputOTPSlot index={2} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                    <InputOTPSlot index={3} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                Confirm MPIN
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={confirmMpin}
                  onChange={setConfirmMpin}
                  onComplete={handleConfirmMpinComplete}
                  disabled={isLoading || mpin.length !== 4}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                    <InputOTPSlot index={1} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                    <InputOTPSlot index={2} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                    <InputOTPSlot index={3} className="h-16 w-16 rounded-xl text-xl font-bold border-2" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Setting up...</span>
              </div>
            )}

            <div className="bg-muted/30 rounded-xl p-4">
              <p className="text-xs text-muted-foreground text-center">
                Your MPIN will be used for quick login. Keep it secure and don't share it with anyone.
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || mpin.length !== 4 || confirmMpin.length !== 4}
            className="w-full gradient-primary h-14 rounded-2xl text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MPINSetupScreen;
