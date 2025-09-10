import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LegalLayout } from "@/components/legal/LegalLayout"

export const Privacy = () => {
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
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <Badge variant="outline">Last updated: January 2025</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Privacy Principles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We're clear about what data we collect and how we use it
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Your data is encrypted and protected with industry standards
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                You have full control over your data and privacy settings
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <p className="text-muted-foreground">
                  When you create an account, we collect your email address, name, and encrypted password.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Fingerprinting Data</h4>
                <p className="text-muted-foreground">
                  We collect device fingerprints including canvas fingerprints, WebGL renderer information, 
                  font detection data, screen resolution, browser information, and TLS/JA3 fingerprints.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Email:</strong> privacy@fingertrace.app</li>
                <li><strong>Data Protection Officer:</strong> privacy@fingertrace.app</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalLayout>
  )
}