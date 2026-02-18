import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated || (user && user.onboardingComplete)) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      await login(phoneNumber);
      toast.success("OTP sent successfully!");
      navigate("/otp-verify", { 
        state: { 
          phoneOrEmail: phoneNumber, 
          isRegisterMode: true 
        } 
      });
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Enter your mobile number to get started
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full pl-12 pr-4 h-14 bg-white rounded-xl border-2 border-border focus:border-primary focus:outline-none text-base"
                autoFocus
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary h-14 rounded-xl text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-muted-foreground"
          >
            Already have an account? <span className="text-primary font-semibold">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
