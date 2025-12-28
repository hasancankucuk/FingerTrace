import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal, Code, Database } from "lucide-react"
import { CodeBlock } from "./CodeBlock"
import { useTranslation } from "react-i18next"

export const QuickStartSection = () => {
  const { t } = useTranslation()

  const quickStartSteps = [
    {
      number: 1,
      icon: <Terminal className="h-5 w-5" />,
      title: t("landing.documentation.quick_start.steps.install.title"),
      description: t("landing.documentation.quick_start.steps.install.description"),
      code: "npm install @fingertrace/trace-sdk"
    },
    {
      number: 2,
      icon: <Code className="h-5 w-5" />,
      title: t("landing.documentation.quick_start.steps.initialize.title"),
      description: t("landing.documentation.quick_start.steps.initialize.description"),
      code: `import { FingerprintSDK } from '@fingertrace/trace-sdk';

const result = await FingerprintSDK();
console.log(result.fingerprint);`
    },
    {
      number: 3,
      icon: <Database className="h-5 w-5" />,
      title: t("landing.documentation.quick_start.steps.send_data.title"),
      description: t("landing.documentation.quick_start.steps.send_data.description"),
      code: `await postData(
  'fingerprint', 
  result, 
  'workspace-id', 
  'api-key'
);`
    }
  ]

  return (
    <section id="quick-start" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          {t("landing.documentation.quick_start.badge")}
        </Badge>
        <h2 className="text-3xl font-bold mb-4">
          {t("landing.documentation.quick_start.title")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("landing.documentation.quick_start.description")}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {quickStartSteps.map((step) => (
          <Card key={step.number} className="relative overflow-hidden">
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {step.number}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step.icon}
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {step.description}
              </p>
              <CodeBlock code={step.code} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}