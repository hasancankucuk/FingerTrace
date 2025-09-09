

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type Step = {
  title: string
  content: React.ReactNode
}

interface StepperProps {
  steps: Step[]
}

export function Stepper({ steps }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold",
                i < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : i === currentStep
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-300 text-gray-400"
              )}
            >
              {i < currentStep ? <Check className="h-5 w-5" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 flex-1",
                  i < currentStep ? "bg-green-500" : "bg-gray-300"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
        >
          Back
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}>
            Next
          </Button>
        ) : (
          <Button variant="default" className="bg-green-600 hover:bg-green-700">
            Finish
          </Button>
        )}
      </div>
    </div>
  )
}