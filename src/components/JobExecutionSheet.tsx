import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Job, Material } from "@/data/types";
import { Camera, CheckCircle, X } from "lucide-react";
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
  const { updateJobStatus, addJobMaterials } = useAppData();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>(job?.materials || []);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Get service category from user's services
  const serviceCategory = job ? user?.services?.find(s => s.name === job.service)?.category : undefined;

  useEffect(() => {
    if (job) {
      setSelectedMaterials(job.materials || []);
    }
  }, [job]);

  if (!job) return null;

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
    updateJobStatus(job.id, "completed");
    toast.success("Job completed!");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[90vh] overflow-y-auto border-0">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
        <SheetHeader>
          <SheetTitle className="text-left text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Execute Job
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Job Info */}
          <div className="bg-muted/50 rounded-2xl p-4">
            <p className="font-bold text-sm mb-1">{job.clientName}</p>
            <p className="text-xs text-muted-foreground">{job.service}</p>
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

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            className="w-full h-12 rounded-2xl gap-2 text-sm font-bold bg-success hover:bg-success/90 border-0"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Job Complete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobExecutionSheet;
