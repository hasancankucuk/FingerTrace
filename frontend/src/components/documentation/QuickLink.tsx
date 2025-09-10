import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface QuickLinkProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  onClick?: () => void
}

export const QuickLink = ({ title, description, href, icon, onClick }: QuickLinkProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Smooth scroll to section
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30 cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="mt-1">
              {description}
            </CardDescription>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
    </Card>
  )
}