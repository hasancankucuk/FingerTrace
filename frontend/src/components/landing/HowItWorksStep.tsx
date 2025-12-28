import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface HowItWorksStepProps {
  stepNumber: number
  title: string
  description: string
  codeExample?: string
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
}

export const HowItWorksStep = ({
  stepNumber,
  title,
  description,
  codeExample,
  showButton = false,
  buttonText,
  onButtonClick
}: HowItWorksStepProps) => {
  const { t } = useTranslation()

  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
        {stepNumber}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>

      {codeExample && (
        <div className="bg-background rounded-lg p-4 font-mono text-sm overflow-x-auto">
          {codeExample}
        </div>
      )}

      {showButton && (
        <Button variant="outline" size="sm" onClick={onButtonClick}>
          {buttonText || t("landing.how_it_works.view_dashboard")}
        </Button>
      )}
    </div>
  )
}