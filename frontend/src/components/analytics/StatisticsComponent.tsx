import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ResponseTimeStats = {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
};

type SatisfactionAnalysis = {
  fast_response_rate: number; // 0-1 arası
  avg_fast_response_time: number;
  avg_slow_response_time: number;
};

type StatisticalProps = {
  response_time_stats?: ResponseTimeStats;
  intent_distribution?: Record<string, number>;
  satisfaction_analysis?: SatisfactionAnalysis;
};

type StatisticsComponentProps = {
  statistical: StatisticalProps;
};

export const StatisticsComponent = ({ statistical }: StatisticsComponentProps) => {
  const stats = statistical?.response_time_stats;
  const intentDist = statistical?.intent_distribution;
  const satisfaction = statistical?.satisfaction_analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Detailed statistical metrics for bot performance</p>
      </CardHeader>
      <CardContent>
        {stats ? (
          <div className="space-y-4">
            {/* Response Time Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{stats.mean.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Mean</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stats.median.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Median</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stats.std.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Std Dev</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stats.min.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Min</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{stats.max.toFixed(2)}s</div>
                <div className="text-sm text-muted-foreground">Max</div>
              </div>
            </div>

            {/* Intent Distribution */}
            {intentDist && (
              <div>
                <h4 className="font-semibold mb-3">Intent Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(intentDist).map(([intent, count]) => (
                    <div key={intent} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium capitalize">{intent}</span>
                      <Badge variant="outline">{count} queries</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Satisfaction Analysis */}
            {satisfaction && (
              <div>
                <h4 className="font-semibold mb-3">Response Quality Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {(satisfaction.fast_response_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Fast Responses</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {satisfaction.avg_fast_response_time.toFixed(2)}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Fast Time</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">
                      {satisfaction.avg_slow_response_time.toFixed(2)}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Slow Time</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        )}
      </CardContent>
    </Card>
  );
};