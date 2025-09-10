import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { HealthResponse } from "@/models/HealthResponse";
import { checkHealth } from "@/services/health";
import { IconRefresh, IconX, IconCheck, IconAlertTriangle, IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const Health = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    getHealthStatus();
  }, []);

  const getHealthStatus = async () => {
    setLoading(true);
    setError(null);
    setStatusCode(null);
    try {
      const res = await checkHealth();
      setHealth(res);
    } catch (e: any) {
      setHealth(null);
      setStatusCode(e.response?.status || 500);
      setError(e.response?.data?.message || e.message || "Failed to fetch health status");
      
      // If we got a 503 with health data, still show it
      if (e.response?.status === 503 && e.response?.data) {
        setHealth(e.response.data);
      }
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

  const getFailedComponents = () => {
    if (!health?.checks) return [];
    return Object.entries(health.checks)
      .filter(([_, value]) => typeof value === "string" && value.toLowerCase().startsWith("error"))
      .map(([key, value]) => ({ component: key, error: value }));
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
          {/* Error Alert for 503 or other errors */}
          {statusCode === 503 && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <IconAlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="font-semibold">Service Degraded (HTTP 503)</div>
                <div className="mt-1">
                  {getFailedComponents().length > 0 ? (
                    <>
                      The following components are experiencing issues:
                      <ul className="mt-2 ml-4 list-disc">
                        {getFailedComponents().map(({ component, error }) => (
                          <li key={component}>
                            <span className="font-medium capitalize">{component}:</span> {error}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    "Some system components are not functioning properly."
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {statusCode && statusCode !== 503 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <IconX className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-semibold">System Error (HTTP {statusCode})</div>
                <div className="mt-1">{error}</div>
              </AlertDescription>
            </Alert>
          )}

          {!health && !statusCode ? (
            <div className="flex flex-col items-center gap-3 text-red-500 py-8">
              <IconX size={48} />
              <div className="text-center">
                <div className="font-semibold">System Unavailable</div>
                <div className="text-sm text-muted-foreground">Unable to fetch health status</div>
              </div>
            </div>
          ) : health ? (
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
                      <div key={key} className={`flex items-center justify-between p-3 rounded-lg border ${
                        isError ? "border-red-200 bg-red-50" : 
                        isOk ? "border-green-200 bg-green-50" : 
                        "border-yellow-200 bg-yellow-50"
                      }`}>
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
                          <span className={`text-sm font-medium ${
                            isOk ? "text-green-700" : 
                            isError ? "text-red-700" : 
                            "text-yellow-700"
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
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
