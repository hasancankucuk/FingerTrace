import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { HealthResponse } from "@/models/HealthResponse"
import { checkHealth } from "@/services/health"
import { IconRefresh, IconX, IconCheck } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export const Health = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null)

  useEffect(() => {
    getHealthStatus()
  }, [])

  const getHealthStatus = async () => {
    try {
      const res = await checkHealth()
      setHealth(res)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setHealth(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Health Checks</CardTitle>
          <CardDescription>System status overview</CardDescription>
        </div>
        <Button onClick={getHealthStatus} size="sm">
          <IconRefresh />
        </Button>
      </CardHeader>

      <CardContent>
        {!health ? (
          <div className="flex flex-col items-center gap-2 text-red-500">
            <IconX size={24} />
            <span>No Data</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className={`text-center font-bold text-lg ${health.status === "healthy" ? "text-green-600" : "text-yellow-600"}`}>
              {health.status.toUpperCase()}
            </div>

            <div className="flex flex-col gap-1">
              {Object.entries(health.checks).map(([key, value]) => {
                const isOk = typeof value === "string" && value.toLowerCase().startsWith("ok")
                return (
                  <div key={key} className="flex items-center gap-2">
                    {isOk ? (
                      <IconCheck className="text-green-500" size={18} />
                    ) : (
                      <IconX className="text-red-500" size={18} />
                    )}
                    <span className="capitalize">{key}: {value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}