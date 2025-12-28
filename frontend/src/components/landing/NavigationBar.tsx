import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { useAuthStore } from "@/store/useAuthStore"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LanguageToggle } from "../language-toggle"
import { ModeToggle } from "../mode-toggle"
import { useTranslation } from "react-i18next"

export const NavigationBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {t} = useTranslation()
  const { token: storeToken } = useAuthStore()
  const token = storeToken || localStorage.getItem("access_token")
  const [open, setOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { name: "nav.documentation", href: "/docs" },
    // { name: "Features", href: "/features" },
    // { name: "Pricing", href: "/pricing" },
    // { name: "Blog", href: "/blog" },
    // { name: "Health", href: "/health" },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link
          to={token ? "/dashboard" : "/"}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <IconInnerShadowTop className="!size-7" />
          </div>
          <span className="font-bold text-xl">FingerTrace</span>
          <Badge variant="secondary" className="ml-2">
            Beta
          </Badge>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink
                    active={isActive(item.href)}
                    className="px-4 py-2 font-medium cursor-pointer"
                    onClick={() => navigate(item.href)}
                  >
                    {t(item.name)}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    {t("auth.login")}
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button onClick={() => navigate('/signup')}>
                    {t("nav.get_started")}
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col gap-2 px-4 py-6">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    onClick={() => {
                      navigate(item.href)
                      setOpen(false)
                    }}
                    className="w-full justify-start"
                  >
                    {t(item.name)}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/login')
                    setOpen(false)
                  }}
                  className="w-full justify-start"
                >
                  {t("auth.login")}
                </Button>
                <Button
                  onClick={() => {
                    navigate('/signup')
                    setOpen(false)
                  }}
                  className="w-full justify-start"
                >
                  {t("nav.get_started")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}