import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate, useLocation } from "react-router-dom"
import { IconInnerShadowTop } from "@tabler/icons-react"

export const NavigationBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { name: "Documentation", href: "/docs" },
    // { name: "Features", href: "/features" },
    // { name: "Pricing", href: "/pricing" },
    // { name: "Blog", href: "/blog" },
    // { name: "Health", href: "/health" },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8 w-8 rounded-lg  flex items-center justify-center">
              <IconInnerShadowTop className="!size-7" />
          </div>
          <span className="font-bold text-xl">FingerTrace</span>
          <Badge variant="secondary" className="ml-2">
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          {navItems.map((item) => (
            <Button 
              key={item.name}
              variant={isActive(item.href) ? 'default' : 'ghost'} 
              onClick={() => navigate(item.href)}
            >
              {item.name}
            </Button>
          ))}
          <Button variant="outline" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  )
}