import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  workCategory?: string;
  businessName?: string;
  city?: string;
  coverageArea?: string;
  profilePhoto?: string;
  description?: string;
  qualifications?: string[];
  documents?: Array<{ type: string; url: string; name: string }>;
  services?: Array<{ name: string; price: number; duration: string; category?: string }>;
  mpin?: string;
  onboardingComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneOrEmail: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<{ isExistingUser: boolean; needsMPIN: boolean }>;
  verifyMPIN: (mpin: string, phoneNumber?: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem("freelancer_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("freelancer_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("freelancer_user");
    }
  }, [user]);

  const login = async (phoneOrEmail: string) => {
    // Simulate OTP sending - in real app, this would call an API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Store phone/email temporarily for OTP verification
        sessionStorage.setItem("pending_auth", phoneOrEmail);
        resolve();
      }, 500);
    });
  };

  const verifyOTP = async (otp: string): Promise<{ isExistingUser: boolean; needsMPIN: boolean }> => {
    // Simulate OTP verification - in real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        const pendingAuth = sessionStorage.getItem("pending_auth");
        if (otp === "123456" && pendingAuth) {
          // Check if user exists
          const storedUser = localStorage.getItem("freelancer_user");
          if (storedUser) {
            const existingUser = JSON.parse(storedUser);
            // Set user directly in context for immediate login
            setUser(existingUser);
            sessionStorage.removeItem("pending_auth");
            resolve({ 
              isExistingUser: true, 
              needsMPIN: !!existingUser.mpin 
            });
          } else {
            // New user - create basic user object
            const newUser: User = {
              id: `user_${Date.now()}`,
              phone: pendingAuth.includes("@") ? undefined : pendingAuth,
              email: pendingAuth.includes("@") ? pendingAuth : undefined,
              onboardingComplete: false,
            };
            setUser(newUser);
            sessionStorage.removeItem("pending_auth");
            resolve({ isExistingUser: false, needsMPIN: false }); // New user, needs onboarding
          }
        } else {
          resolve({ isExistingUser: false, needsMPIN: false });
        }
      }, 500);
    });
  };

  const verifyMPIN = async (mpin: string, phoneNumber?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // First check sessionStorage for pending_user (from OTP flow)
        const pendingUserStr = sessionStorage.getItem("pending_user");
        if (pendingUserStr) {
          const pendingUser = JSON.parse(pendingUserStr);
          if (pendingUser.mpin === mpin) {
            // Ensure onboarding is complete for login
            const userToSet = { ...pendingUser, onboardingComplete: true };
            // Save to localStorage immediately
            localStorage.setItem("freelancer_user", JSON.stringify(userToSet));
            setUser(userToSet);
            sessionStorage.removeItem("pending_user");
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          // Check localStorage for direct MPIN login
          const storedUser = localStorage.getItem("freelancer_user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.mpin === mpin) {
              // Ensure onboarding is complete for existing users logging in
              const userToSet = { ...user, onboardingComplete: true };
              // Save to localStorage immediately
              localStorage.setItem("freelancer_user", JSON.stringify(userToSet));
              setUser(userToSet);
              resolve(true);
            } else {
              // MPIN doesn't match, but create/update user anyway (no validation)
              const userToSet = { ...user, onboardingComplete: true, mpin };
              localStorage.setItem("freelancer_user", JSON.stringify(userToSet));
              setUser(userToSet);
              resolve(true);
            }
          } else {
            // No user exists, create a default user (no validation)
            const defaultUser: User = {
              id: `user_${Date.now()}`,
              phone: phoneNumber || undefined,
              mpin,
              onboardingComplete: true,
            };
            localStorage.setItem("freelancer_user", JSON.stringify(defaultUser));
            setUser(defaultUser);
            resolve(true);
          }
        }
      }, 500);
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const completeOnboarding = () => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, onboardingComplete: true };
    });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  // Calculate isAuthenticated based on user state
  const isAuthenticated = !!user && user.onboardingComplete;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        verifyOTP,
        verifyMPIN,
        updateUser,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
