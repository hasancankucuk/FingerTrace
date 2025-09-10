import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Terminal, Code, Database } from "lucide-react"
import { CodeBlock } from "./CodeBlock"

const quickStartSteps = [
  {
    number: 1,
    icon: <Terminal className="h-5 w-5" />,
    title: "Install SDK",
    description: "Add our lightweight SDK to your project with npm or yarn",
    code: "npm install @fingertrace/trace-sdk"
  },
  {
    number: 2,
    icon: <Code className="h-5 w-5" />,
    title: "Initialize",
    description: "Import and initialize the SDK in your application",
    code: `import { FingerprintSDK } from '@fingertrace/trace-sdk';

const result = await FingerprintSDK();
console.log(result.fingerprint);`
  },
  {
    number: 3,
    icon: <Database className="h-5 w-5" />,
    title: "Send Data",
    description: "Send fingerprint data to your FingerTrace workspace",
    code: `await postData(
  'fingerprint', 
  result, 
  'workspace-id', 
  'api-key'
);`
  }
]

export const QuickStartSection = () => {
  return (
    <section id="quick-start" className="mb-16">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">Quick Start</Badge>
        <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Follow these simple steps to integrate FingerTrace into your application
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