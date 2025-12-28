import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

interface HeroSectionProps {
  onQuickStart?: () => void
}

export const HeroSection = ({ onQuickStart }: HeroSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("landing.documentation.hero.badge")}
            </Badge>
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            {t("landing.documentation.hero.title_1")}
            <span className="text-primary">{t("landing.documentation.hero.title_2")}</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("landing.documentation.hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              className="gap-2"
              onClick={onQuickStart}
            >
              <Play className="h-4 w-4" />
              {t("landing.documentation.hero.quick_start")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}