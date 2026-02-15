import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2, Camera, Plus, X } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { toast } from "sonner";

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [description, setDescription] = useState(user?.description || "");
  const [qualifications, setQualifications] = useState<string[]>(user?.qualifications || []);
  const [newQualification, setNewQualification] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePhoto(url);
    }
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const addQualification = () => {
    if (newQualification.trim() && !qualifications.includes(newQualification.trim())) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };

  const removeQualification = (qual: string) => {
    setQualifications(qualifications.filter((q) => q !== qual));
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      updateUser({
        description,
        qualifications,
        profilePhoto: profilePhoto || undefined,
      });
      navigate("/onboarding/services");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressIndicator currentStep={4} totalSteps={6} stepLabels={["Basic", "Location", "Documents", "Profile", "Services", "MPIN"]} />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Complete Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Help clients understand your expertise
            </p>
          </div>

          <div className="space-y-5">
            {/* Profile Photo */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center border-2 border-border">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full gradient-primary flex items-center justify-center shadow-md active:scale-95"
                  >
                    <Camera className="h-4 w-4 text-primary-foreground" />
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex-1">
                  Add a professional photo to build trust
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell clients about your experience and expertise..."
                rows={4}
                className="w-full bg-white rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 py-3 text-base font-medium shadow-sm resize-none"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                {description.length}/500 characters
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                Qualifications & Certifications
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addQualification()}
                  placeholder="e.g., Certified Electrician"
                  className="flex-1 h-12 bg-white rounded-xl border-2 border-border/50 focus:border-primary focus:outline-none px-4 text-sm font-medium shadow-sm"
                />
                <button
                  onClick={addQualification}
                  className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-sm active:scale-95"
                >
                  <Plus className="h-5 w-5 text-primary-foreground" />
                </button>
              </div>
              {qualifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {qualifications.map((qual) => (
                    <div
                      key={qual}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      <span>{qual}</span>
                      <button
                        onClick={() => removeQualification(qual)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

export default ProfileSetupScreen;
