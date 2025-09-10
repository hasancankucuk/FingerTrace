import { NavigationBar } from "@/components/landing/NavigationBar"
import { FooterSection } from "@/components/landing/FooterSection"

interface LegalLayoutProps {
  children: React.ReactNode
}

export const LegalLayout = ({ children }: LegalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      {children}
      <FooterSection />
    </div>
  )
}