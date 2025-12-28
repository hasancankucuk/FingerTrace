import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LegalLayout } from "@/components/legal/LegalLayout"

export const Security = () => {
  const { t } = useTranslation("landing")
  const navigate = useNavigate()

  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: t("legal.security.features.encryption.title"),
      description: t("legal.security.features.encryption.description")
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("legal.security.features.soc2.title"),
      description: t("legal.security.features.soc2.description")
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: t("legal.security.features.audits.title"),
      description: t("legal.security.features.audits.description")
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: t("legal.security.features.monitoring.title"),
      description: t("legal.security.features.monitoring.description")
    }
  ]

  return (
    <LegalLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("legal.back_to_home")}
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">{t("legal.security.title")}</h1>
            <Badge variant="outline">{t("legal.last_updated")}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {t("legal.security.description")}
          </p>
        </div>

        {/* Security Features Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {securityFeatures.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          {/* Infrastructure Security */}
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.security.infrastructure.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t("legal.security.infrastructure.cloud.title")}</h4>
                <p className="text-muted-foreground mb-3">
                  {t("legal.security.infrastructure.cloud.description")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.security.contact.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("legal.security.contact.description")}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>{t("legal.security.contact.team")}</strong> security@fingertrace.app</li>
                <li><strong>{t("legal.security.contact.response_time")}</strong> {t("legal.security.contact.response_desc")}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalLayout>
  )
}