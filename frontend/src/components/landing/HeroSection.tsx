import { Badge } from "@/components/ui/badge"

export const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <Badge variant="outline" className="px-4 py-2">
          🚀 Now in Public Beta
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Track Every{" "}
          <span className="text-primary">Interaction</span>
          <br />
          Understand Every{" "}
          <span className="text-primary">User</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          FingerTrace provides comprehensive user analytics and interaction tracking
          to help you build better products. Get insights into how users actually
          use your application.
        </p>
      </div>
    </section>
  )
}