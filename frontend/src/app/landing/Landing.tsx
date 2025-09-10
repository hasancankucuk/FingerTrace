import { NavigationBar } from "@/components/landing/NavigationBar"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { FooterSection } from "@/components/landing/FooterSection"

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FooterSection />
    </div>
  )
}