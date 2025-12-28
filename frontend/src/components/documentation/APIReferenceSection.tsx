import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { CodeBlock } from "./CodeBlock"
import { useTranslation } from "react-i18next"

export const APIReferenceSection = () => {
  const { t } = useTranslation()

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/fingerprints',
      description: t("landing.documentation.api_reference.endpoints.create_record"),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    {
      method: 'GET',
      endpoint: '/api/fingerprints',
      description: t("landing.documentation.api_reference.endpoints.list_all"),
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      method: 'POST',
      endpoint: '/api/deviceinfo',
      description: t("landing.documentation.api_reference.endpoints.submit_info"),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    {
      method: 'POST',
      endpoint: '/api/workspaces',
      description: t("landing.documentation.api_reference.endpoints.create_workspace"),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
  ]

  return (
    <section id="api-reference" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          {t("landing.documentation.api_reference.badge")}
        </Badge>
        <h2 className="text-3xl font-bold mb-4">
          {t("landing.documentation.api_reference.title")}
        </h2>
      </div>

      <div className="space-y-8">
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("landing.documentation.api_reference.auth.title")}
            </CardTitle>
            <CardDescription>
              {t("landing.documentation.api_reference.auth.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">
                  {t("landing.documentation.api_reference.auth.jwt")}
                </h4>
                <CodeBlock code={`headers: {
  'Authorization': 'Bearer jwt-token',
  'Content-Type': 'application/json'
}`} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {t("landing.documentation.api_reference.auth.api_key")}
                </h4>
                <CodeBlock code={`headers: {
  'Authorization': 'Bearer api-key',
  'Content-Type': 'application/json'
}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("landing.documentation.api_reference.endpoints.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge className={endpoint.color}>
                      {endpoint.method}
                    </Badge>
                    <code className="font-mono text-sm">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-sm text-muted-foreground hidden md:block">
                    {endpoint.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}