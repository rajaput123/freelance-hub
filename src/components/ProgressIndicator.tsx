import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isPending = step > currentStep;

          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex items-center">
                {/* Progress line */}
                {step < totalSteps && (
                  <div
                    className={cn(
                      "absolute top-1/2 left-1/2 w-full h-0.5 -translate-y-1/2 z-0",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                    style={{ width: "calc(100% - 24px)", left: "calc(50% + 12px)" }}
                  />
                )}

                {/* Step circle */}
                <div
                  className={cn(
                    "relative z-10 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted && "bg-primary border-primary",
                    isCurrent && "bg-primary border-primary scale-110",
                    isPending && "bg-background border-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-bold",
                        isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step}
                    </span>
                  )}
                </div>
              </div>

              {/* Step label */}
              {stepLabels && stepLabels[index] && (
                <p
                  className={cn(
                    "text-[10px] font-medium mt-2 text-center max-w-[60px]",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {stepLabels[index]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress text */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
};

export default ProgressIndicator;
