import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LegalLayout } from "@/components/legal/LegalLayout"

export const Terms = () => {
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
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <Badge variant="outline">Last updated: January 2025</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Please read these Terms of Service carefully before using FingerTrace.
          </p>
        </div>

        <div className="space-y-8">
          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle>1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing and using FingerTrace ("Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your use of our website located at fingertrace.app 
                (the "Service") operated by FingerTrace ("us", "we", or "our").
              </p>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of FingerTrace SDK per license for 
                personal or commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on FingerTrace's website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account Terms */}
          <Card>
            <CardHeader>
              <CardTitle>3. Account Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You are responsible for safeguarding the password and API keys that you use to access the Service 
                and for all activities that occur under your account.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>4. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Some features of the Service may require payment. By providing payment information, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You have the legal right to use the payment method provided</li>
                <li>All payment information is accurate and current</li>
                <li>You will pay all charges incurred by your account</li>
                <li>Fees are non-refundable except as required by law</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at legal@fingertrace.app
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalLayout>
  )
}