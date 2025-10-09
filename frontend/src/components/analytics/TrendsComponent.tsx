import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type MovingAveragePoint = {
  timestamp: string;
  avg_response_time: number;
};

type TrendsProps = {
  trend_direction: "improving" | "declining" | "stable";
  recent_performance?: number;
  improvement_percentage: number;
  moving_averages?: MovingAveragePoint[];
  baseline_performance?: number;
};

type TrendsComponentProps = {
  trends?: TrendsProps;
};

export const TrendsComponent = ({ trends }: TrendsComponentProps) => {
  const trendColor = trends?.trend_direction === "improving"
    ? "bg-green-500"
    : trends?.trend_direction === "declining"
    ? "bg-red-500"
    : "bg-gray-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {trends && <div className={`h-4 w-4 rounded-full ${trendColor}`}></div>}
          Performance Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Long-term performance analysis and trends
        </p>
      </CardHeader>
      <CardContent>
        {trends ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-2xl font-bold capitalize">{trends.trend_direction}</div>
                <div className="text-sm text-muted-foreground">Overall Trend</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold">{trends.recent_performance?.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Recent Performance</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold">
                  {trends.improvement_percentage > 0 ? "+" : ""}
                  {trends.improvement_percentage?.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Performance Change</div>
              </div>
            </div>

            {/* Moving Averages */}
            {trends.moving_averages && trends.moving_averages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Recent Performance Trend</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {trends.moving_averages.slice(-10).map((point, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
                    >
                      <span>{new Date(point.timestamp).toLocaleDateString()}</span>
                      <Badge variant="outline">{point.avg_response_time.toFixed(2)}s avg</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h5 className="font-medium mb-2">Baseline Performance</h5>
                <div className="text-lg font-bold">{trends.baseline_performance?.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Historical average</div>
              </div>
              <div className="p-4 border rounded">
                <h5 className="font-medium mb-2">Current Performance</h5>
                <div className="text-lg font-bold">{trends.recent_performance?.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Recent average</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        )}
      </CardContent>
    </Card>
  );
};