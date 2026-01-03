import { LanguageToggle } from "@/components/language-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { SignupForm } from "./forms/SignupForm"

export default function SignupPage() {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
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

        {/* <SignupForm className="w-full" /> */}
        <SignupForm />

        <div className="text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Finger Trace. All rights reserved.
        </div>
      </div>
    </div>
  )
}