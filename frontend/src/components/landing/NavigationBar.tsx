import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate, useLocation } from "react-router-dom"

export const NavigationBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">FT</span>
          </div>
          <span className="font-bold text-xl">FingerTrace</span>
          <Badge variant="secondary" className="ml-2">
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant={isActive('/docs') ? 'default' : 'ghost'} 
            onClick={() => navigate('/docs')}
          >
            Documentation
          </Button>
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