import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const OTPVerifyScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, updateUser, completeOnboarding, user, isAuthenticated } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const phoneOrEmail = location.state?.phoneOrEmail || "";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user?.onboardingComplete) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOTPComplete = async (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      setIsLoading(true);
      try {
        const result = await verifyOTP(value);
        const isRegisterMode = location.state?.isRegisterMode || false;
        
        if (result.isExistingUser) {
          // Existing user - ensure onboarding is complete
          completeOnboarding();
          toast.success("Login successful!");
          // Wait for state to update before navigating
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 500);
        } else {
          // New user
          if (isRegisterMode) {
            // New user registration - navigate to onboarding flow
            toast.success("OTP verified! Let's set up your profile.");
            
            // Small delay before navigating to onboarding
            setTimeout(() => {
              navigate("/onboarding/basic-info", { replace: true });
            }, 500);
          } else {
            // User tried to login but doesn't exist - show error and redirect to login
            toast.error("Account not found. Please register first.");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
        }
      } catch (error) {
        toast.error("Invalid OTP. Please try again.");
        setOtp("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(30);
    setOtp("");
    toast.success("OTP resent successfully!");
    // In real app, call login API again
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <div className="gradient-primary rounded-b-3xl shadow-lg pt-12 pb-8 px-6">
        <button
          onClick={() => {
            const isRegisterMode = location.state?.isRegisterMode || false;
            navigate(isRegisterMode ? "/register" : "/login");
          }}
          className="mb-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Verify OTP
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Enter the 6-digit code sent to
          </p>
          <p className="text-primary-foreground font-semibold mt-1">{phoneOrEmail}</p>
        </div>
      </div>

      {/* OTP Input */}
      <div className="flex-1 px-6 pt-8">
        <div className="max-w-lg mx-auto">
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleOTPComplete}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                  <InputOTPSlot index={1} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                  <InputOTPSlot index={2} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                  <InputOTPSlot index={3} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                  <InputOTPSlot index={4} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                  <InputOTPSlot index={5} className="h-14 w-14 rounded-xl text-lg font-bold border-2" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Verifying...</span>
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend}
                className="text-sm font-semibold text-primary flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className={`h-4 w-4 ${canResend ? "animate-spin" : ""}`} />
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>
            </div>

            <div className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                For testing, use OTP: <span className="font-bold text-primary">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyScreen;
