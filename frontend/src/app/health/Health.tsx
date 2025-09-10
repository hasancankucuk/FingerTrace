import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HealthResponse } from "@/models/HealthResponse";
import { checkHealth } from "@/services/health";
import { IconRefresh, IconX, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const Health = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getHealthStatus();
  }, []);

  const getHealthStatus = async () => {
    setLoading(true);
    try {
      const res = await checkHealth();
      setHealth(res);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      default:
        return "text-red-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <IconCheck className="text-green-500" size={32} />;
      case "degraded":
        return <IconAlertTriangle className="text-yellow-500" size={32} />;
      default:
        return <IconX className="text-red-500" size={32} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle>System Health</CardTitle>
              <CardDescription>Monitor system components status</CardDescription>
            </div>
            <Button onClick={getHealthStatus} size="sm" disabled={loading}>
              <IconRefresh className={loading ? "animate-spin" : ""} />
              {loading ? "Checking..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!health ? (
            <div className="flex flex-col items-center gap-3 text-red-500 py-8">
              <IconX size={48} />
              <div className="text-center">
                <div className="font-semibold">System Unavailable</div>
                <div className="text-sm text-muted-foreground">Unable to fetch health status</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="flex flex-col items-center gap-3 pb-4 border-b">
                {getStatusIcon(health.status)}
                <div className="text-center">
                  <div className={`font-bold text-2xl ${getStatusColor(health.status)}`}>
                    {health.status.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {health.status === "healthy" 
                      ? "All systems operational" 
                      : health.status === "degraded"
                      ? "Some issues detected"
                      : "System experiencing problems"
                    }
                  </div>
                </div>
              </div>

              {/* Component Checks */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Component Status</h3>
                <div className="grid gap-3">
                  {Object.entries(health.checks).map(([key, value]) => {
                    const isOk = typeof value === "string" && value.toLowerCase().startsWith("ok");
                    const isError = typeof value === "string" && value.toLowerCase().startsWith("error");
                    
                    return (
                      <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-3">
                          {isOk ? (
                            <IconCheck className="text-green-500" size={20} />
                          ) : isError ? (
                            <IconX className="text-red-500" size={20} />
                          ) : (
                            <IconAlertTriangle className="text-yellow-500" size={20} />
                          )}
                          <span className="font-medium capitalize">{key}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm ${
                            isOk ? "text-green-600" : 
                            isError ? "text-red-600" : 
                            "text-yellow-600"
                          }`}>
                            {value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
