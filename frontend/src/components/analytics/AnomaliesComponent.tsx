import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Anomaly = {
  session_id: string | number;
  timestamp: string;
  response_time: number;
  z_score: number;
};

type AnomaliesProps = {
  response_time_anomalies?: Anomaly[];
  intent_drift_detected?: boolean;
};

type AnomaliesComponentProps = {
  anomalies: AnomaliesProps;
};

export const AnomaliesComponent = ({ anomalies }: AnomaliesComponentProps) => {
  const responseAnomalies = anomalies?.response_time_anomalies || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Detection</CardTitle>
      </CardHeader>
      <CardContent>
        {anomalies ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {responseAnomalies.length}
                </div>
                <div className="text-sm text-muted-foreground">Response Time Anomalies</div>
              </div>
              <div className="text-center">
                <Badge
                  variant={anomalies.intent_drift_detected ? "destructive" : "secondary"}
                >
                  {anomalies.intent_drift_detected ? "Drift Detected" : "No Drift"}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Intent Drift Status</div>
              </div>
            </div>

            {/* Anomaly Details */}
            {responseAnomalies.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Recent Anomalies</h4>
                {responseAnomalies.slice(0, 5).map((anomaly, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-red-50 rounded"
                  >
                    <div>
                      <div className="font-semibold">Session: {anomaly.session_id}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{anomaly.response_time.toFixed(2)}s</div>
                      <Badge variant="destructive">
                        Z-Score: {anomaly.z_score.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-pulse h-24 bg-gray-200 rounded"></div>
        )}
      </CardContent>
    </Card>
  );
};