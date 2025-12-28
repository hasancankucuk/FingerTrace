import { FooterSection } from "@/components/landing/FooterSection"
import { NavigationBar } from "@/components/landing/NavigationBar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowRight, BarChart3, Bell, Check, Code, Database, Eye, Globe, Lock, Monitor, Server, Shield, Smartphone, Users, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

const mainFeatures = [
  {
    icon: <Code className="h-8 w-8" />,
    title: "Developer-First SDK",
    description: "Simple integration with any codebase. One line of code gets you started.",
    features: [
      "React, Vue, Angular support",
      "Node.js, Python, PHP backends",
      "TypeScript support included",
      "Zero configuration setup"
    ]
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Real-time Tracking",
    description: "Monitor user interactions and application performance in real-time.",
    features: [
      "Live user session tracking",
      "Real-time event streaming",
      "Performance monitoring",
      "Custom event tracking"
    ]
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards and insights to understand user behavior.",
    features: [
      "Interactive dashboards",
      "Custom reports",
      "Funnel analysis",
      "Cohort analysis"
    ]
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Privacy-First",
    description: "GDPR compliant with built-in privacy controls and data anonymization.",
    features: [
      "GDPR & CCPA compliant",
      "Data anonymization",
      "Cookie-free tracking",
      "Privacy controls"
    ]
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description: "Minimal performance impact with efficient data collection and processing.",
    features: [
      "< 10kb bundle size",
      "Edge-based processing",
      "Async data collection",
      "CDN optimized"
    ]
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Team Collaboration",
    description: "Share insights across your team with collaborative workspaces.",
    features: [
      "Team workspaces",
      "Role-based access",
      "Shared dashboards",
      "Comment system"
    ]
  }
]

const fingerprinting = [
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Canvas Fingerprinting",
    description: "Advanced canvas-based device identification"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Browser Fingerprinting",
    description: "Comprehensive browser and system profiling"
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Device Detection",
    description: "Mobile and desktop device identification"
  },
  {
    icon: <Monitor className="h-6 w-6" />,
    title: "Screen Analysis",
    description: "Resolution, color depth, and display metrics"
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "TLS Fingerprinting",
    description: "Network-level device identification"
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Audio Fingerprinting",
    description: "Hardware-based audio context analysis"
  }
]

const integrations = [
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Webhooks",
    description: "Real-time event notifications to your systems"
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: "REST API",
    description: "Complete API access for custom integrations"
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Data Export",
    description: "Export your data in multiple formats"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "SSO Integration",
    description: "Single sign-on with your existing systems"
  }
]

export const Features = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationBar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="outline" className="px-4 py-2">
            🚀 Comprehensive Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Everything you need for{" "}
            <span className="text-primary">User Analytics</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From basic page views to advanced device fingerprinting, FingerTrace provides
            all the tools you need to understand your users completely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/docs')}>
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers, designed for scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fingerprinting Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Fingerprinting Technology</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Device Identification
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge fingerprinting technology identifies devices with 99.5% accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fingerprinting.map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mx-auto w-fit mb-3">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Integrations Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Integrations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seamless Integration
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect FingerTrace with your existing tools and workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mx-auto w-fit mb-3">
                    {integration.icon}
                  </div>
                  <CardTitle className="text-lg">{integration.title}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-muted/30 rounded-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of developers who trust FingerTrace for their analytics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/docs')}>
                View Documentation
              </Button>
            </div>
          </div>
        </section>
      </div>

      <FooterSection />
    </div>
  )
}