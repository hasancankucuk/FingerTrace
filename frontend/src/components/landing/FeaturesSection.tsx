import { Badge } from "@/components/ui/badge"
import { Code, Database, BarChart3, Shield, Zap, Users } from "lucide-react"
import { FeatureCard } from "./FeatureCard"
import { useTranslation } from "react-i18next"

export const FeaturesSection = () => {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: t("landing.features.developer_first.title"),
      description: t("landing.features.developer_first.description")
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: t("landing.features.real_time.title"),
      description: t("landing.features.real_time.description")
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: t("landing.features.rich_analytics.title"),
      description: t("landing.features.rich_analytics.description")
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("landing.features.privacy_first.title"),
      description: t("landing.features.privacy_first.description")
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t("landing.features.fast.title"),
      description: t("landing.features.fast.description")
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t("landing.features.collaboration.title"),
      description: t("landing.features.collaboration.description")
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="features">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline">{t("landing.features.badge")}</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          {t("landing.features.title")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("landing.features.description")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}