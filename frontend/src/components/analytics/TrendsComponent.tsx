import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

type DailyTrendPoint = {
  avg_response_time: number;
  total_interactions: number;
  top_intent?: string | null;
  avg_answer_length?: number;
  unique_intents?: number;
};

type HourlyTrendPoint = {
  avg_response_time: number;
  total_interactions: number;
};

type TrendsProps = {
  trend_direction: "improving" | "degrading" | "stable" | "unknown";
  trends?: Record<string, DailyTrendPoint>;
  hourly_trends?: Record<string, HourlyTrendPoint>; // Changed from Record<number, ...> to Record<string, ...>
  summary?: {
    total_days?: number;
    peak_hour?: number | null;
    best_performance_day?: string | null;
  };
  improvement_percentage?: number;
};

type TrendsComponentProps = {
  trends: TrendsProps | null;
  loading: boolean;
};

export const TrendsComponent = ({ trends, loading }: TrendsComponentProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <p className="text-sm text-muted-foreground">Long-term performance analysis and trends</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Loading Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse text-center p-4 bg-gray-50 rounded">
                  <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Loading Moving Averages */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
              <div className="space-y-2 max-h-60">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Performance Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trendsData = trends?.trends || {};
  const hourlyTrends = trends?.hourly_trends || {};
  const trendDirection = trends?.trend_direction || "stable";
  const summary = trends?.summary;

  // Calculate recent performance from the latest daily trend
  const getRecentPerformance = () => {
    const dates = Object.keys(trendsData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (dates.length > 0) {
      return trendsData[dates[0]]?.avg_response_time;
    }
    return null;
  };

  // Calculate baseline performance (average of all daily trends)
  const getBaselinePerformance = () => {
    const values = Object.values(trendsData).map((d: any) => d.avg_response_time).filter(v => v != null);
    if (values.length > 0) {
      return values.reduce((a, b) => a + b, 0) / values.length;
    }
    return null;
  };

  // Calculate improvement percentage (comparing recent vs baseline)
  const getImprovementPercentage = () => {
    const recent = getRecentPerformance();
    const baseline = getBaselinePerformance();
    if (recent != null && baseline != null && baseline !== 0) {
      return ((baseline - recent) / baseline) * 100;
    }
    return 0;
  };

  const recentPerformance = getRecentPerformance();
  const baselinePerformance = getBaselinePerformance();
  const improvementPercentage = getImprovementPercentage();

  const getTrendIcon = () => {
    switch (trendDirection) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "degrading":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case "improving":
        return "text-green-600 bg-green-50 border-green-200";
      case "degrading":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPerformanceChangeColor = () => {
    if (trends == null || trends.improvement_percentage == null) return "text-gray-600";
    return trends.improvement_percentage > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Long-term performance analysis and trends
        </p>
      </CardHeader>
      <CardContent>
        {trends ? (
          <div className="space-y-6">
            {/* Trend Overview */}
            <div className={`p-4 rounded-lg border ${getTrendColor()}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTrendIcon()}
                  <div>
                    <h3 className="font-semibold capitalize">{trendDirection} Trend</h3>
                    <p className="text-sm opacity-80">
                      {trendDirection === "improving"
                        ? "Performance is getting better over time"
                        : trendDirection === "degrading"
                        ? "Performance needs attention"
                        : "Performance is stable"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={trendDirection === "improving" ? "default" :
                           trendDirection === "degrading" ? "destructive" : "secondary"}
                >
                  {improvementPercentage > 0 ? "+" : ""}
                  {improvementPercentage.toFixed(1)}%
                </Badge>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {recentPerformance != null ? recentPerformance.toFixed(2) : "N/A"}s
                </div>
                <div className="text-sm text-muted-foreground">Recent Performance</div>
                <div className="text-xs text-blue-600 mt-1">Latest available data</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                <div className={`text-2xl font-bold ${getPerformanceChangeColor()}`}>
                  {improvementPercentage > 0 ? "+" : ""}
                  {improvementPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Performance Change</div>
                <div className="text-xs text-purple-600 mt-1">vs baseline</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded border border-gray-200">
                <div className="text-2xl font-bold text-gray-600">
                  {baselinePerformance != null ? baselinePerformance.toFixed(2) : "N/A"}s
                </div>
                <div className="text-sm text-muted-foreground">Baseline</div>
                <div className="text-xs text-gray-600 mt-1">Historical average</div>
              </div>
            </div>

            {/* Performance Trend Summary */}
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded mb-4">
              <Badge variant={
                trendDirection === 'improving' ? 'default' :
                trendDirection === 'degrading' ? 'destructive' : 'secondary'
              }>
                {trendDirection}
              </Badge>
              <span className="text-sm">
                Based on {summary?.total_days || 0} days of data
              </span>
              {summary?.peak_hour != null && (
                <span className="text-sm">
                  Peak hour: {summary.peak_hour}:00
                </span>
              )}
            </div>

            {/* Daily Performance Timeline */}
            {Object.keys(trendsData).length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  📈 Daily Performance Timeline
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 rounded p-3">
                  {Object.entries(trendsData)
                    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                    .slice(-10)
                    .map(([date, data]: [string, any]) => (
                      <div
                        key={date}
                        className="flex justify-between items-center p-2 bg-white rounded text-sm shadow-sm"
                      >
                        <div>
                          <span className="font-medium">
                            {new Date(date).toLocaleDateString()}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {data.unique_intents ?? 0} unique intents
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{data.avg_response_time?.toFixed(2)}s</div>
                          <div className="text-xs text-muted-foreground">
                            {data.total_interactions} interactions • {data.avg_answer_length != null ? data.avg_answer_length.toFixed(0) : "-"} chars avg
                          </div>
                          {data.top_intent && (
                            <div className="text-xs text-blue-600">
                              Top: {data.top_intent}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Hourly Performance Pattern */}
            {Object.keys(hourlyTrends).length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  🕐 Hourly Performance Pattern
                </h4>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({length: 24}, (_, hour) => {
                    const hourData = hourlyTrends[hour.toString()]; // Convert to string since API returns string keys
                    const intensity = hourData ? Math.min(hourData.total_interactions / 10, 1) : 0;
                    
                    return (
                      <div
                        key={hour}
                        className="text-center p-2 rounded text-xs"
                        style={{
                          backgroundColor: hourData ? `rgba(59, 130, 246, ${intensity})` : '#f3f4f6',
                          color: intensity > 0.5 ? 'white' : '#374151'
                        }}
                      >
                        <div className="font-bold">{hour}:00</div>
                        {hourData && (
                          <div>
                            <div>{hourData.total_interactions}</div>
                            <div className="text-xs opacity-75">{hourData.avg_response_time?.toFixed(1)}s</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Performance Comparison Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  📊 Performance Comparison
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Baseline Performance:</span>
                    <span className="font-bold">{baselinePerformance?.toFixed(2) ?? "N/A"}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Performance:</span>
                    <span className="font-bold">{recentPerformance?.toFixed(2) ?? "N/A"}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        improvementPercentage > 0 ? 'bg-green-500' : 
                        improvementPercentage < 0 ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.abs(improvementPercentage) * 2)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  🎯 Performance Status
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      trendDirection === "improving" ? 'bg-green-500' :
                      trendDirection === "degrading" ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm capitalize">{trendDirection} trend detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      Math.abs(improvementPercentage) < 5 ? 'bg-green-500' :
                      Math.abs(improvementPercentage) < 15 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">
                      {Math.abs(improvementPercentage) < 5 ? 'Stable performance' :
                       Math.abs(improvementPercentage) < 15 ? 'Moderate variation' : 'High variation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights & Recommendations */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h6 className="font-medium text-blue-800 mb-2">Performance Insights</h6>
              <div className="text-sm text-blue-700 space-y-1">
                {trendDirection === "improving" && (
                  <p>✅ Great job! Performance is consistently improving. Keep monitoring to maintain this trend.</p>
                )}
                {trendDirection === "degrading" && (
                  <p>⚠️ Performance is degrading. Consider investigating recent changes or increasing system resources.</p>
                )}
                {trendDirection === "stable" && (
                  <p>📊 Performance is stable. Monitor for any sudden changes and consider optimization opportunities.</p>
                )}
                {Math.abs(improvementPercentage) > 20 && (
                  <p>🔍 Significant performance change detected. Review recent deployments or system changes.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-600 mb-2">No Trend Data</h3>
            <p className="text-gray-500 text-sm">Performance trend analysis will appear once sufficient data is collected.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};