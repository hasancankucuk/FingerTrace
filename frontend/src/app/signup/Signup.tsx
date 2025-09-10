import { SignupForm } from "@/components/signup-form"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { GalleryVerticalEnd } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md">
            <IconInnerShadowTop className="!size-7" />
          </div>
          <span>Finger Trace</span>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}