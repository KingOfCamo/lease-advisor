"use client";

import { useWizard } from "./wizard-context";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STEPS = [
  "Client",
  "Property",
  "Parties & Term",
  "Rent & Reviews",
  "Outgoings",
  "Incentives & Security",
  "Key Clauses",
  "Review & Save",
];

export function WizardShell({ children }: { children: React.ReactNode }) {
  const { state, goToStep } = useWizard();
  const progress = ((state.currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Progress value={progress} className="h-2" />
        <div className="flex gap-1 overflow-x-auto">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => goToStep(i)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors",
                i === state.currentStep
                  ? "bg-navy-700 text-white"
                  : i < state.currentStep
                  ? "bg-navy-100 text-navy-700 hover:bg-navy-200"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {i + 1}. {step}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">{children}</div>
    </div>
  );
}
