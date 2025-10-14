import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, Search } from "lucide-react";

type Anomaly = {
  session_id: string;
  response_time: number;
  z_score: number;
  question: string;
  timestamp: string;
  intent_category: string;
};

type IntentAnomaly = {
  intent: string;
  count: number;
  percentage: number;
  anomaly_type: "rare" | "dominant";
};

type AnomaliesProps = {
  anomalies?: Anomaly[];
  intent_anomalies?: IntentAnomaly[];
  total_checked?: number;
  total_anomalies?: number; // Added for frontend compatibility
  statistics?: {
    mean_response_time: number;
    std_response_time: number;
    anomaly_threshold: number;
  };
  message?: string;
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

  const responseAnomalies = anomalies?.anomalies || [];
  const intentAnomalies = anomalies?.intent_anomalies || [];
  const totalAnomalies = anomalies?.total_anomalies || (responseAnomalies.length + intentAnomalies.length);
  const totalChecked = anomalies?.total_checked || 0;
  const statistics = anomalies?.statistics;

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {totalAnomalies}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Anomalies
                </div>
                {totalAnomalies > 0 && (
                  <div className="text-xs text-red-500 mt-1">
                    Requires attention
                  </div>
                )}
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">
                  {responseAnomalies.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Response Time Anomalies
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">
                  {intentAnomalies.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Intent Pattern Anomalies
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {totalChecked}
                </div>
                <div className="text-sm text-muted-foreground">
                  Sessions Analyzed
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  Sample size
                </div>
              </div>
            </div>

            {/* Statistics Summary */}
            {statistics && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Detection Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mean Response Time:</span>
                    <div className="font-bold">{statistics.mean_response_time.toFixed(2)}s</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Standard Deviation:</span>
                    <div className="font-bold">{statistics.std_response_time.toFixed(2)}s</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Anomaly Threshold:</span>
                    <div className="font-bold">{statistics.anomaly_threshold}σ</div>
                  </div>
                </div>
              </div>
            )}

            {/* Response Time Anomalies */}
            {responseAnomalies.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Response Time Anomalies ({responseAnomalies.length})
                </h4>
                <div className="space-y-2">
                  {responseAnomalies.slice(0, 10).map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-red-800">
                          Session: {anomaly.session_id}
                        </div>
                        <div className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          Query: "{anomaly.question}"
                        </div>
                        <div className="text-xs text-red-500 mt-1">
                          Intent: {anomaly.intent_category} • {new Date(anomaly.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-red-800">
                          {anomaly.response_time.toFixed(2)}s
                        </div>
                        <Badge 
                          variant={Math.abs(anomaly.z_score) > 3 ? "destructive" : "outline"}
                          className="text-xs mt-1"
                        >
                          Z: {anomaly.z_score.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intent Pattern Anomalies */}
            {intentAnomalies.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  Intent Pattern Anomalies ({intentAnomalies.length})
                </h4>
                <div className="space-y-2">
                  {intentAnomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-purple-800">
                          Intent: {anomaly.intent}
                        </div>
                        <div className="text-sm text-purple-600">
                          {anomaly.count} occurrences ({anomaly.percentage}%)
                        </div>
                      </div>
                      <Badge 
                        variant={anomaly.anomaly_type === "rare" ? "outline" : "secondary"}
                        className="capitalize"
                      >
                        {anomaly.anomaly_type}
                      </Badge>
                    </div>
                  ))}
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