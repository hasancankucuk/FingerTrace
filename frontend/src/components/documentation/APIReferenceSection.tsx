import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { CodeBlock } from "./CodeBlock"

const apiEndpoints = [
  {
    method: 'POST',
    endpoint: '/api/fingerprints',
    description: 'Create a new fingerprint record',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  {
    method: 'GET',
    endpoint: '/api/fingerprints',
    description: 'List all fingerprints in workspace',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  {
    method: 'POST',
    endpoint: '/api/deviceinfo',
    description: 'Submit device information',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
  {
    method: 'POST',
    endpoint: '/api/workspaces',
    description: 'Create a new workspace',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
]

export const APIReferenceSection = () => {
  return (
    <section id="api-reference" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">API Reference</Badge>
        <h2 className="text-3xl font-bold mb-4">Complete API Documentation</h2>
      </div>

      <div className="space-y-8">
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              All API requests require proper authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">JWT Token (Dashboard)</h4>
                <CodeBlock code={`headers: {
  'Authorization': 'Bearer jwt-token',
  'Content-Type': 'application/json'
}`} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">API Key (SDK)</h4>
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
            <CardTitle>API Endpoints</CardTitle>
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