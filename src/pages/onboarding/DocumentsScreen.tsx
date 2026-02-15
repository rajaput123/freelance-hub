import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Loader2, Shield } from "lucide-react";
import ProgressIndicator from "@/components/ProgressIndicator";
import DocumentUpload from "@/components/DocumentUpload";
import { toast } from "sonner";

interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  file: File;
}

const DocumentsScreen = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const requiredTypes = ["Identity", "Business"];

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // Convert documents to the format expected by user
      const documentData = documents.map((doc) => ({
        type: doc.type,
        url: doc.url,
        name: doc.name,
      }));

      updateUser({ documents: documentData });
      navigate("/onboarding/profile");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressIndicator currentStep={3} totalSteps={6} stepLabels={["Basic", "Location", "Documents", "Profile", "Services", "MPIN"]} />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Verify Your Identity
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload documents to build trust with clients. Your information is secure and encrypted.
            </p>
          </div>

          <DocumentUpload
            documents={documents}
            onDocumentsChange={setDocuments}
            requiredTypes={requiredTypes}
          />

          <div className="bg-info/10 border border-info/20 rounded-xl p-4">
            <p className="text-xs text-info font-medium">
              💡 Accepted: Aadhar, PAN, Driving License, Business License, GST Certificate
            </p>
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

export default DocumentsScreen;
