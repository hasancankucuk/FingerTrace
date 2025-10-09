import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity } from "lucide-react";

type Anomaly = {
  session_id: string | number;
  timestamp: string;
  response_time: number;
  z_score: number;
};

type AnomaliesProps = {
  response_time_anomalies?: Anomaly[];
  intent_drift_detected?: boolean;
  intent_drift_details?: string[];
  total_anomalies?: number;
};

type AnomaliesComponentProps = {
  anomalies: AnomaliesProps | null;
  loading: boolean;
};

export const AnomaliesComponent = ({ anomalies, loading }: AnomaliesComponentProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detecting unusual patterns and behaviors
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Loading Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse text-center p-4 bg-gray-50 rounded"
                >
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Loading Anomaly List */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const responseAnomalies = anomalies?.response_time_anomalies || [];
  const totalAnomalies = anomalies?.total_anomalies || responseAnomalies.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Anomaly Detection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detecting unusual patterns and behaviors
        </p>
      </CardHeader>
      <CardContent>
        {anomalies ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {totalAnomalies}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Anomalies
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">
                  {responseAnomalies.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Response Time Anomalies
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <Badge
                  variant={
                    anomalies.intent_drift_detected ? "destructive" : "default"
                  }
                  className="text-lg px-4 py-2"
                >
                  {anomalies.intent_drift_detected ? "Drift Detected" : "No Drift"}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">
                  Intent Drift Status
                </div>
              </div>
            </div>

            {/* System Health Status */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">System Health Status:</span>
                <Badge
                  variant={
                    totalAnomalies === 0
                      ? "default"
                      : totalAnomalies <= 5
                      ? "secondary"
                      : "destructive"
                  }
                  className="flex items-center gap-1"
                >
                  <Activity className="h-3 w-3" />
                  {totalAnomalies === 0
                    ? "Healthy"
                    : totalAnomalies <= 5
                    ? "Monitor"
                    : "Critical"}
                </Badge>
              </div>
            </div>

            {/* Intent Drift Details */}
            {anomalies.intent_drift_detected &&
              anomalies.intent_drift_details &&
              anomalies.intent_drift_details.length > 0 && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Intent Drift Details
                  </h4>
                  <div className="space-y-1">
                    {anomalies.intent_drift_details.map((detail, index) => (
                      <p key={index} className="text-sm text-yellow-700">
                        • {detail}
                      </p>
                    ))}
                  </div>
                </div>
              )}

            {/* Response Time Anomalies */}
            {responseAnomalies.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Recent Response Time Anomalies
                </h4>
                <div className="space-y-2">
                  {responseAnomalies.slice(0, 10).map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-red-800">
                          Session: {anomaly.session_id}
                        </div>
                        <div className="text-sm text-red-600">
                          {new Date(anomaly.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-800">
                          {anomaly.response_time.toFixed(2)}s
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Z-Score: {anomaly.z_score.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {responseAnomalies.length > 10 && (
                    <div className="text-center py-2">
                      <Badge variant="outline">
                        +{responseAnomalies.length - 10} more anomalies
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Anomalies State */}
            {totalAnomalies === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">
                  System Running Smoothly
                </h3>
                <p className="text-green-600 text-sm">
                  No anomalies detected in the current monitoring period.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No anomaly data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};