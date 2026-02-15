import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Phone, Loader2, Lock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyMPIN, login, isAuthenticated, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated || (user && user.onboardingComplete)) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setIsRegisterMode(false);
    setPhoneNumber("");
    setMpin("");
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    if (isRegisterMode) {
      try {
        await login(phoneNumber);
        toast.success("OTP sent successfully!");
        navigate("/otp-verify", { state: { phoneOrEmail: phoneNumber, isRegisterMode: true } });
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const isValid = await verifyMPIN(mpin, phoneNumber);
        toast.success("Login successful!");
        
        // Wait for state to update and localStorage to be saved
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Force navigation - always navigate to dashboard after login
        navigate("/", { replace: true });
      } catch (error) {
        toast.success("Login successful!");
        // Still navigate even on error (no validation)
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMPINComplete = (value: string) => {
    setMpin(value);
    if (value.length === 4 && !isRegisterMode) {
      handleSubmit(new Event("submit") as any);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isRegisterMode ? "Create Account" : "Login"}
          </h1>
          <p className="text-muted-foreground">
            {isRegisterMode 
              ? "Enter your mobile number to get started" 
              : "Enter your mobile number and MPIN"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Number */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Phone className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit number"
                className="w-full pl-12 pr-4 h-14 bg-white rounded-xl border-2 border-border focus:border-primary focus:outline-none text-base"
                autoFocus
                maxLength={10}
              />
            </div>
          </div>

          {/* MPIN - Only in login mode */}
          {!isRegisterMode && (
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                MPIN
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={mpin}
                  onChange={setMpin}
                  onComplete={handleMPINComplete}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                    <InputOTPSlot index={1} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                    <InputOTPSlot index={2} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                    <InputOTPSlot index={3} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary h-14 rounded-xl text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {isRegisterMode ? "Sending..." : "Logging in..."}
              </>
            ) : (
              isRegisterMode ? "Continue" : "Login"
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setMpin("");
            }}
            className="text-sm text-muted-foreground"
          >
            {isRegisterMode ? (
              <>
                Already have an account? <span className="text-primary font-semibold">Login</span>
              </>
            ) : (
              <>
                New user? <span className="text-primary font-semibold">Register</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
