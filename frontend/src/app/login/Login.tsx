import { LoginForm } from "@/components/login-form"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center p-6 dark:bg-zinc-950 bg-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full ur-[120px] opacity-50" />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <IconInnerShadowTop className="size-5" />
            </div>
            <span>Finger Trace</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
        </div>

        <LoginForm className="w-full" />

        <div className="text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Finger Trace. All rights reserved.
        </div>
      </div>
    </div>
  )
}