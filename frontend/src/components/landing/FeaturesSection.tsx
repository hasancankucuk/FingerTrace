import { Badge } from "@/components/ui/badge"
import { Code, Database, BarChart3, Shield, Zap, Users } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

const features = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "Developer-First",
    description: "Built by developers, for developers. Simple integration with any codebase."
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Real-time Tracking",
    description: "Monitor user interactions and application performance in real-time."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Rich Analytics",
    description: "Comprehensive dashboards and insights to understand user behavior."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy-First",
    description: "GDPR compliant with built-in privacy controls and data anonymization."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Minimal performance impact with efficient data collection and processing."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Share insights across your team with collaborative workspaces."
  }
]

export const FeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-4 mb-16">
        <Badge variant="outline">Features</Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          Everything you need to understand your users
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From basic page views to complex user journey analysis,
          FingerTrace provides all the tools you need.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
}