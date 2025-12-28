import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LegalLayout } from "@/components/legal/LegalLayout"

export const Terms = () => {
  const { t } = useTranslation("landing")
  const navigate = useNavigate()

  return (
    <LegalLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <h1 className="text-4xl font-bold">{t("legal.terms.title")}</h1>
            <Badge variant="outline">{t("legal.last_updated")}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            {t("legal.terms.description")}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("legal.terms.sections.agreement.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("legal.terms.sections.agreement.desc_1")}
              </p>
              <p className="text-muted-foreground">
                {t("legal.terms.sections.agreement.desc_2")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("legal.terms.sections.license.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("legal.terms.sections.license.description")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {Array.isArray(t("legal.terms.sections.license.items", { returnObjects: true })) &&
                  (t("legal.terms.sections.license.items", { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("legal.terms.sections.account.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("legal.terms.sections.account.description")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {Array.isArray(t("legal.terms.sections.account.items", { returnObjects: true })) &&
                  (t("legal.terms.sections.account.items", { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("legal.terms.sections.payment.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t("legal.terms.sections.payment.description")}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                {Array.isArray(t("legal.terms.sections.payment.items", { returnObjects: true })) &&
                  (t("legal.terms.sections.payment.items", { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("legal.terms.sections.contact.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("legal.terms.sections.contact.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalLayout>
  )
}