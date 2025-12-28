import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "./CodeBlock"
import { useTranslation } from "react-i18next"

export const ExamplesSection = () => {
  const { t } = useTranslation()

  const examples = [
    {
      title: t("landing.documentation.examples.items.fraud.title"),
      description: t("landing.documentation.examples.items.fraud.description"),
      code: `// Checkout fraud detection
const detectFraud = async (userId, cartValue) => {
  const fingerprint = await FingerprintSDK();
  
  const riskScore = await fetch('/api/risk-analysis', {
    method: 'POST',
    body: JSON.stringify({
      fingerprint: fingerprint.fingerprint,
      userId,
      cartValue,
      timestamp: Date.now()
    })
  });
  
  if (riskScore.high) {
    // Trigger additional verification
    return { requiresVerification: true };
  }
  
  return { allowCheckout: true };
};`
    }]

  return (
    <section id="examples" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          {t("landing.documentation.examples.badge")}
        </Badge>
        <h2 className="text-3xl font-bold mb-4">
          {t("landing.documentation.examples.title")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("landing.documentation.examples.description")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {examples.map((example, index) => (
          <Card key={index} className="h-fit">
            <CardHeader>
              <CardTitle>{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={example.code} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}