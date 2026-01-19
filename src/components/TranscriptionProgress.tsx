import { Check, Loader2, Upload, Volume2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type TranscriptionStep = "uploading" | "extracting" | "transcribing" | "formatting" | "complete";

interface TranscriptionProgressProps {
  currentStep: TranscriptionStep;
  progress?: number;
}

const steps = [
  { id: "uploading", label: "Uploading", icon: Upload, description: "Preparing your video..." },
  { id: "extracting", label: "Extracting Audio", icon: Volume2, description: "Converting video to audio..." },
  { id: "transcribing", label: "Transcribing", icon: FileText, description: "AI is processing speech..." },
  { id: "formatting", label: "Formatting", icon: Sparkles, description: "Polishing your transcript..." },
];

const TranscriptionProgress = ({ currentStep, progress = 0 }: TranscriptionProgressProps) => {
  const getStepStatus = (stepId: string) => {
    const stepOrder = steps.map((s) => s.id);
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (currentStep === "complete") return "complete";
    if (stepIndex < currentIndex) return "complete";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-border">
          <div
            className="h-full gradient-bg transition-all duration-500 ease-out"
            style={{
              width: `${
                currentStep === "complete"
                  ? 100
                  : (steps.findIndex((s) => s.id === currentStep) / (steps.length - 1)) * 100
              }%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                    status === "complete" && "gradient-bg text-primary-foreground",
                    status === "current" && "gradient-bg text-primary-foreground animate-pulse-glow",
                    status === "pending" && "bg-secondary text-muted-foreground"
                  )}
                >
                  {status === "complete" ? (
                    <Check className="h-5 w-5" />
                  ) : status === "current" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-3 text-sm font-medium transition-colors",
                    status === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Description */}
      {currentStep !== "complete" && (
        <div className="mt-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary rounded-full">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium">
              {steps.find((s) => s.id === currentStep)?.description}
            </span>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mt-6 w-full max-w-md mx-auto">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
          )}
        </div>
      )}

      {/* Complete State */}
      {currentStep === "complete" && (
        <div className="mt-12 text-center animate-scale-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Transcription Complete!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionProgress;
