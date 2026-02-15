import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const MPINSetupScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser, completeOnboarding, logout } = useAuth();
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMpinComplete = (value: string) => {
    setMpin(value);
  };

  const handleConfirmMpinComplete = async (value: string) => {
    setConfirmMpin(value);
    if (value.length === 4 && mpin.length === 4) {
      if (value === mpin) {
        setIsLoading(true);
        try {
          updateUser({ mpin });
          completeOnboarding();
          toast.success("Registration complete! Please login to continue.");
          logout();
          navigate("/login");
        } catch (error) {
          toast.error("Something went wrong. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error("MPINs do not match. Please try again.");
        setMpin("");
        setConfirmMpin("");
      }
    }
  };

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
        </div>
      </div>
    </div>
  );
};

export default MPINSetupScreen;
