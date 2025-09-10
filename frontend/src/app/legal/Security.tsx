import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LegalLayout } from "@/components/legal/LegalLayout"

export const Security = () => {
  const navigate = useNavigate()

  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "SOC 2 Type II Compliant",
      description: "Our infrastructure meets the highest security and availability standards"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Regular Security Audits",
      description: "Independent third-party security assessments and penetration testing"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "24/7 Monitoring",
      description: "Continuous monitoring for threats and anomalous activity"
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
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Security & Compliance</h1>
            <Badge variant="outline">Updated: January 2025</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn how we protect your data and maintain the highest security standards.
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
              <CardTitle>Infrastructure Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Cloud Infrastructure</h4>
                <p className="text-muted-foreground mb-3">
                  FingerTrace is built on enterprise-grade cloud infrastructure with multiple layers of security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Security Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                For security-related questions or to report vulnerabilities:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Security Team:</strong> security@fingertrace.app</li>
                <li><strong>Response Time:</strong> Within 24 hours for critical issues</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalLayout>
  )
}