import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LegalLayout } from "@/components/legal/LegalLayout"

export const Privacy = () => {
  const { t } = useTranslation("landing")
  const navigate = useNavigate()

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
            <h1 className="text-4xl font-bold">{t("legal.privacy.title")}</h1>
            <Badge variant="outline">{t("legal.last_updated")}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {t("legal.privacy.description")}
          </p>
        </div>

        {/* Privacy Principles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">{t("legal.privacy.principles.transparency.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {t("legal.privacy.principles.transparency.description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">{t("legal.privacy.principles.security.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {t("legal.privacy.principles.security.description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">{t("legal.privacy.principles.control.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {t("legal.privacy.principles.control.description")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.privacy.sections.collect.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t("legal.privacy.sections.collect.account.title")}</h4>
                <p className="text-muted-foreground">
                  {t("legal.privacy.sections.collect.account.description")}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t("legal.privacy.sections.collect.fingerprint.title")}</h4>
                <p className="text-muted-foreground">
                  {t("legal.privacy.sections.collect.fingerprint.description")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.privacy.sections.contact.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("legal.privacy.sections.contact.description")}
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>{t("legal.privacy.sections.contact.email")}</strong> privacy@fingertrace.app</li>
                <li><strong>{t("legal.privacy.sections.contact.dpo")}</strong> privacy@fingertrace.app</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalLayout>
  )
}