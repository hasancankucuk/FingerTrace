import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

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
  statistical: StatisticalProps | null;
  loading: boolean;
};

export const StatisticsComponent = ({ statistical, loading }: StatisticsComponentProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistical Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed statistical metrics for bot performance</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Loading Response Time Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse text-center">
                  <div className="h-6 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Loading Intent Distribution */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Satisfaction Analysis */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse text-center p-4 bg-gray-50 rounded">
                    <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = statistical?.response_time_stats;
  const intentDist = statistical?.intent_distribution;
  const satisfaction = statistical?.satisfaction_analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Statistical Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">Detailed statistical metrics for bot performance</p>
      </CardHeader>
      <CardContent>
        {statistical ? (
          <div className="space-y-6">
            {/* Response Time Stats */}
            {stats && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Response Time Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-xl font-bold text-blue-600">{stats.mean.toFixed(2)}s</div>
                    <div className="text-sm text-muted-foreground">Mean</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-xl font-bold text-green-600">{stats.median.toFixed(2)}s</div>
                    <div className="text-sm text-muted-foreground">Median</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-xl font-bold text-yellow-600">{stats.std.toFixed(2)}s</div>
                    <div className="text-sm text-muted-foreground">Std Dev</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-xl font-bold text-purple-600">{stats.min.toFixed(2)}s</div>
                    <div className="text-sm text-muted-foreground">Min</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-xl font-bold text-red-600">{stats.max.toFixed(2)}s</div>
                    <div className="text-sm text-muted-foreground">Max</div>
                  </div>
                </div>

                {/* Performance Insight */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Performance Variability:</span>
                    <Badge variant={stats.std <= 1 ? "default" : stats.std <= 2 ? "secondary" : "destructive"}>
                      {stats.std <= 1 ? "Consistent" : stats.std <= 2 ? "Moderate" : "High Variance"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Intent Distribution */}
            {intentDist && Object.keys(intentDist).length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Intent Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(intentDist)
                    .sort(([, a], [, b]) => b - a) // Sort by count descending
                    .map(([intent, count]) => {
                      const total = Object.values(intentDist).reduce((sum, c) => sum + c, 0);
                      const percentage = ((count / total) * 100).toFixed(1);
                      return (
                        <div key={intent} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <span className="font-medium capitalize">{intent.replace('_', ' ')}</span>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                            <Badge variant="outline">{count} queries</Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Satisfaction Analysis */}
            {satisfaction && (
              <div>
                <h4 className="font-semibold mb-3">Response Quality Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {(satisfaction.fast_response_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Fast Responses</div>
                    <div className="mt-2">
                      <Badge variant={satisfaction.fast_response_rate >= 0.8 ? "default" : "secondary"}>
                        {satisfaction.fast_response_rate >= 0.8 ? "Excellent" : "Good"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">
                      {satisfaction.avg_fast_response_time.toFixed(2)}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Fast Time</div>
                    <div className="mt-2">
                      <Badge variant="outline">Target: &lt;2s</Badge>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {satisfaction.avg_slow_response_time.toFixed(2)}s
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Slow Time</div>
                    <div className="mt-2">
                      <Badge variant={satisfaction.avg_slow_response_time <= 5 ? "secondary" : "destructive"}>
                        {satisfaction.avg_slow_response_time <= 5 ? "Acceptable" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Response Time Recommendation */}
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <h6 className="font-medium text-blue-800 mb-2">Performance Insights</h6>
                  <div className="text-sm text-blue-700 space-y-1">
                    {satisfaction.fast_response_rate >= 0.8 ? (
                      <p>✅ Excellent response time consistency - keep up the good work!</p>
                    ) : (
                      <p>⚠️ Consider optimizing slower responses to improve overall performance.</p>
                    )}
                    {satisfaction.avg_slow_response_time > 5 && (
                      <p>🔧 Slow responses exceed 5s - investigate potential bottlenecks.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* No Data State */}
            {!stats && !intentDist && !satisfaction && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-600 mb-2">No Statistical Data</h3>
                <p className="text-gray-500 text-sm">Statistical analysis will appear once sufficient data is collected.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No statistical data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};