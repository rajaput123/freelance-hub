import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const MPINVerifyScreen = () => {
  const navigate = useNavigate();
  const { verifyMPIN } = useAuth();
  const [mpin, setMpin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMPINComplete = async (value: string) => {
    setMpin(value);
    if (value.length === 4) {
      setIsLoading(true);
      try {
        const isValid = await verifyMPIN(value);
        if (isValid) {
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error("Invalid MPIN. Please try again.");
          setMpin("");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        setMpin("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <div className="gradient-primary rounded-b-3xl shadow-lg pt-12 pb-8 px-6">
        <button
          onClick={() => navigate("/login")}
          className="mb-6 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="max-w-lg mx-auto text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Enter Your MPIN
          </h1>
          <p className="text-primary-foreground/80 text-sm">
            Enter your 4-digit MPIN to continue
          </p>
        </div>
      </div>

      {/* MPIN Input */}
      <div className="flex-1 px-6 pt-8">
        <div className="max-w-lg mx-auto">
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={mpin}
                onChange={setMpin}
                onComplete={handleMPINComplete}
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

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Verifying...</span>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-semibold text-primary"
              >
                Use OTP instead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPINVerifyScreen;
