import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Briefcase } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate("/");
        } else {
          navigate("/login");
        }
      }, 2000); // 2 second splash screen

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center">
      <div className="text-center">
        <div className="h-20 w-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
          <Briefcase className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          FieldHand
        </h1>
        <p className="text-primary-foreground/80 font-medium">Service Management</p>
      </div>
    </div>
  );
};

export default SplashScreen;
