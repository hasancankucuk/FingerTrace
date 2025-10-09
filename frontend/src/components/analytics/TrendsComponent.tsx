import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

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

  const getTrendIcon = () => {
    switch (trends?.trend_direction) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trends?.trend_direction) {
      case "improving":
        return "text-green-600 bg-green-50 border-green-200";
      case "declining":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPerformanceChangeColor = () => {
    if (!trends?.improvement_percentage) return "text-gray-600";
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
                    <h3 className="font-semibold capitalize">{trends.trend_direction} Trend</h3>
                    <p className="text-sm opacity-80">
                      {trends.trend_direction === "improving" 
                        ? "Performance is getting better over time"
                        : trends.trend_direction === "declining"
                        ? "Performance needs attention"
                        : "Performance is stable"}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={trends.trend_direction === "improving" ? "default" : 
                          trends.trend_direction === "declining" ? "destructive" : "secondary"}
                >
                  {trends.improvement_percentage > 0 ? "+" : ""}
                  {trends.improvement_percentage?.toFixed(1)}%
                </Badge>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {trends.recent_performance?.toFixed(2) || 'N/A'}s
                </div>
                <div className="text-sm text-muted-foreground">Recent Performance</div>
                <div className="text-xs text-blue-600 mt-1">Last 7 days average</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                <div className={`text-2xl font-bold ${getPerformanceChangeColor()}`}>
                  {trends.improvement_percentage > 0 ? "+" : ""}
                  {trends.improvement_percentage?.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Performance Change</div>
                <div className="text-xs text-purple-600 mt-1">vs baseline</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded border border-gray-200">
                <div className="text-2xl font-bold text-gray-600">
                  {trends.baseline_performance?.toFixed(2) || 'N/A'}s
                </div>
                <div className="text-sm text-muted-foreground">Baseline</div>
                <div className="text-xs text-gray-600 mt-1">Historical average</div>
              </div>
            </div>

            {/* Performance Comparison Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-3 flex items-center gap-2">
                  📊 Performance Comparison
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Baseline Performance:</span>
                    <span className="font-bold">{trends.baseline_performance?.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Performance:</span>
                    <span className="font-bold">{trends.recent_performance?.toFixed(2)}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        trends.improvement_percentage > 0 ? 'bg-green-500' : 
                        trends.improvement_percentage < 0 ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.abs(trends.improvement_percentage) * 2)}%`
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
                      trends.trend_direction === "improving" ? 'bg-green-500' :
                      trends.trend_direction === "declining" ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm capitalize">{trends.trend_direction} trend detected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      Math.abs(trends.improvement_percentage) < 5 ? 'bg-green-500' :
                      Math.abs(trends.improvement_percentage) < 15 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">
                      {Math.abs(trends.improvement_percentage) < 5 ? 'Stable performance' :
                       Math.abs(trends.improvement_percentage) < 15 ? 'Moderate variation' : 'High variation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Moving Averages Timeline */}
            {trends.moving_averages && trends.moving_averages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  📈 Recent Performance Timeline
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto bg-gray-50 rounded p-3">
                  {trends.moving_averages.slice(-10).reverse().map((point, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-white rounded text-sm shadow-sm"
                    >
                      <span className="font-medium">
                        {new Date(point.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit'
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={
                            point.avg_response_time <= 2 ? 'border-green-300 text-green-700' :
                            point.avg_response_time <= 3 ? 'border-yellow-300 text-yellow-700' :
                            'border-red-300 text-red-700'
                          }
                        >
                          {point.avg_response_time.toFixed(2)}s
                        </Badge>
                        {index === 0 && <Badge variant="default" className="text-xs">Latest</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights & Recommendations */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <h6 className="font-medium text-blue-800 mb-2">Performance Insights</h6>
              <div className="text-sm text-blue-700 space-y-1">
                {trends.trend_direction === "improving" && (
                  <p>✅ Great job! Performance is consistently improving. Keep monitoring to maintain this trend.</p>
                )}
                {trends.trend_direction === "declining" && (
                  <p>⚠️ Performance is declining. Consider investigating recent changes or increasing system resources.</p>
                )}
                {trends.trend_direction === "stable" && (
                  <p>📊 Performance is stable. Monitor for any sudden changes and consider optimization opportunities.</p>
                )}
                {Math.abs(trends.improvement_percentage) > 20 && (
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