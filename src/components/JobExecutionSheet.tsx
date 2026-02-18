import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Job, Material } from "@/data/types";
import { Camera, CheckCircle, X, MessageSquare } from "lucide-react";
import { useAppData } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import MaterialSelector from "./MaterialSelector";

interface JobExecutionSheetProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobExecutionSheet = ({ job, open, onOpenChange }: JobExecutionSheetProps) => {
  const { updateJobStatus, addJobMaterials, updateJobNotes } = useAppData();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>(job?.materials || []);
  const [review, setReview] = useState<string>("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Get service category from user's services
  const serviceCategory = job ? user?.services?.find(s => s.name === job.service)?.category : undefined;

  useEffect(() => {
    if (job) {
      setSelectedMaterials(job.materials || []);
      setReview(job.notes || "");
      setPhotos([]); // Reset photos when job changes
    }
  }, [job]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos([...photos, ...newPhotos]);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    // Update materials if changed
    if (selectedMaterials.length > 0) {
      addJobMaterials(job.id, selectedMaterials);
    }
    
    // Save review/comment
    if (review.trim()) {
      updateJobNotes(job.id, review.trim());
    }
    
    updateJobStatus(job.id, "completed");
    toast.success("Job completed with review!");
    onOpenChange(false);
  };

  // NEVER return null - always render Sheet component
  return (
    <Sheet open={open && !!job} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        {job ? (
          <>
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
            <SheetHeader>
              <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Complete Job & Add Review
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4">
              {/* Job Info */}
              <div className="bg-muted/50 rounded-2xl p-4">
                <p className="font-bold text-sm mb-1">{job.clientName || job.freelancerName || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{job.service || job.taskName || "Service"}</p>
                <p className="text-xs text-muted-foreground mt-2">{job.location}</p>
              </div>

          {/* Photos */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Job Photos</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50 active:scale-95 transition-all"
              >
                <Camera className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">Add photos of work progress</p>
          </div>

          {/* Materials */}
          <MaterialSelector
            selectedMaterials={selectedMaterials}
            onMaterialsChange={setSelectedMaterials}
            jobId={job.id}
            serviceCategory={serviceCategory}
          />

          {/* Review/Comment Section */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Review / Comments
            </label>
            <Textarea
              placeholder="Add your review, comments, or notes about the completed job..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="rounded-xl text-sm min-h-[100px]"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">Share your experience, feedback, or any important notes about this job</p>
          </div>

              {/* Complete Button */}
              <Button
                onClick={handleComplete}
                className="w-full h-12 rounded-2xl gap-2 text-sm font-bold bg-success hover:bg-success/90 border-0"
              >
                <CheckCircle className="h-4 w-4" />
                Complete Job
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No job selected</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default JobExecutionSheet;
