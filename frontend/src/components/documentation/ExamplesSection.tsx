import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "./CodeBlock"

const examples = [
  {
    title: "E-commerce Fraud Detection",
    description: "Detect suspicious activity during checkout process",
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
  },
  {
    title: "User Analytics & Personalization",
    description: "Track user behavior across sessions",
    code: `// User behavior tracking
const trackUserBehavior = async (action, data) => {
  const fingerprint = await FingerprintSDK();
  
  await postData('user-action', {
    fingerprint: fingerprint.fingerprint,
    action,
    data,
    timestamp: Date.now(),
    sessionId: fingerprint.sessionId
  }, workspaceId, apiKey);
  
  // Update personalization
  await updateUserPreferences(fingerprint.fingerprint, data);
};

// Usage
trackUserBehavior('product_view', { productId: '123' });
trackUserBehavior('add_to_cart', { productId: '123', quantity: 2 });`
  }
]

export const ExamplesSection = () => {
  return (
    <section id="examples" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">Examples</Badge>
        <h2 className="text-3xl font-bold mb-4">Real-World Examples</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn from practical implementations and best practices
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