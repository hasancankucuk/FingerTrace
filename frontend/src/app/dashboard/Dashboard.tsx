import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const npmInstall = `npm install trace-sdk`
const yarnInstall = `yarn add trace-sdk`

const usageCodeMap: Record<string, string> = {
  "JavaScript": `const TraceSDK = require('trace-sdk');

(async () => {
  const result = await TraceSDK();
  console.log('fingerprint:', result.fingerprint);
  console.log('isIncognito:', result.isIncognito);
})();`,
  "React": `import TraceSDK from 'trace-sdk';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    (async () => {
      const result = await TraceSDK();
      console.log('fingerprint:', result.fingerprint);
      console.log('isIncognito:', result.isIncognito);
    })();
  }, []);
}`,
  "Next.js": `import TraceSDK from 'trace-sdk';

export default async function Page() {
  const result = await TraceSDK();
  console.log('fingerprint:', result.fingerprint);
  console.log('isIncognito:', result.isIncognito);
  return <div>...</div>;
}`,
  "Angular": `import TraceSDK from 'trace-sdk';

ngOnInit() {
  (async () => {
    const result = await TraceSDK();
    console.log('fingerprint:', result.fingerprint);
    console.log('isIncognito:', result.isIncognito);
  })();
}`,
  "Vue.js": `import TraceSDK from 'trace-sdk';

mounted() {
  (async () => {
    const result = await TraceSDK();
    console.log('fingerprint:', result.fingerprint);
    console.log('isIncognito:', result.isIncognito);
  })();
}`
}

const frameworks = ["JavaScript", "Next.js", "React", "Angular", "Vue.js"]

export default function Dashboard() {
  const navigate = useNavigate()
  const [platform, setPlatform] = useState<"web" | "mobile">("web")
  const [framework, setFramework] = useState<string>("JavaScript")
  const [copied, setCopied] = useState<{ npm: boolean; yarn: boolean; code: boolean }>({
    npm: false,
    yarn: false,
    code: false,
  })

  const handleCopy = async (text: string, type: "npm" | "yarn" | "code") => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied((prev) => ({ ...prev, [type]: true }))
      setTimeout(() => setCopied({ npm: false, yarn: false, code: false }), 1400)
    } catch {
      // ignore
    }
  }

  const renderCodeBlock = (code: string, type: "npm" | "yarn" | "code") => (
    <div className="relative">
      <SyntaxHighlighter language="javascript" style={atomDark} wrapLines>
        {code}
      </SyntaxHighlighter>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={() => handleCopy(code, type)}
      >
        {copied[type] ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
      </Button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Platform */}
          <section>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">1</Badge>
              <h3 className="text-sm font-medium">Platform</h3>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant={platform === "web" ? "default" : "outline"}
                onClick={() => setPlatform("web")}
              >
                Web
              </Button>
              <Button
                variant={platform === "mobile" ? "default" : "outline"}
                onClick={() => setPlatform("mobile")}
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                Mobile
              </Button>
            </div>
          </section>

          {/* Framework */}
          <section>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">2</Badge>
              <h3 className="text-sm font-medium">Framework</h3>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {frameworks.map((fw) => (
                <Button
                  key={fw}
                  variant={framework === fw ? "default" : "outline"}
                  onClick={() => setFramework(fw)}
                >
                  {fw}
                </Button>
              ))}
            </div>
          </section>

          {/* Install */}
          <section>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">3</Badge>
              <h3 className="text-sm font-medium">Install</h3>
            </div>
            <div className="mt-3 grid gap-3">
              {renderCodeBlock(npmInstall, "npm")}
              {renderCodeBlock(yarnInstall, "yarn")}
            </div>
          </section>

          {/* Usage */}
          <section>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">4</Badge>
              <h3 className="text-sm font-medium">Usage</h3>
            </div>
            <div className="mt-3">{renderCodeBlock(usageCodeMap[framework], "code")}</div>
          </section>

          {/* Docs Button */}
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => navigate("/docs")}>
              Open docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}