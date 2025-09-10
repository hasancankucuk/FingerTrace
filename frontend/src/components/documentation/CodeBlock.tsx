import { CopyButton } from "./CopyButton"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export const CodeBlock = ({ code, language = "javascript", className = "" }: CodeBlockProps) => (
  <div className={`relative group ${className}`}>
    <div className="bg-gray-950 text-gray-100 p-6 rounded-lg overflow-x-auto border">
      <CopyButton text={code} />
      <pre className="text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  </div>
)