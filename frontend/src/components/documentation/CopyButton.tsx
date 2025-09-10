import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useState } from "react"

interface CopyButtonProps {
  text: string
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <span className="text-green-600 text-xs font-medium">Copied!</span>
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}