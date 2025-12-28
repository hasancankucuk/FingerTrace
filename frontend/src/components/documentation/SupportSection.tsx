import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"

interface SupportSectionProps {
  onContactSupport?: () => void
}

export const SupportSection = ({ onContactSupport }: SupportSectionProps) => {
  const { t } = useTranslation()

  return (
    <section className="mb-16">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            {t("landing.documentation.support.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("landing.documentation.support.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={onContactSupport}
            >
              <ExternalLink className="h-4 w-4" />
              {t("landing.documentation.support.contact")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}