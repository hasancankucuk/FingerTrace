import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

type TrendType = "improving" | "declining" | "stable" | string;

type ExecutiveSummaryType = {
  overview?: {
    report_period?: string;
    generated_at?: string;
  };
  key_metrics: {
    total_conversations?: number;
    unique_users?: number;
    avg_response_time?: string | number;
    user_satisfaction?: string | number;
    resolution_rate?: string;
    accessibility_score?: string | number;
    cost_per_interaction?: string | number;
  };
  trends?: {
    response_time_trend?: TrendType;
    volume_trend?: TrendType;
    satisfaction_trend?: TrendType;
    summary?: string;
  };
  recommendations?: string[];
  top_insights?: string[];
  risk_indicators?: string[];
};

type ExecutiveDashboardProps = {
  executiveDashboard: {
    executive_summary?: ExecutiveSummaryType;
  },
  loading: boolean;
};

export const ExecutiveSummaryComponent = ({ executiveDashboard, loading }: ExecutiveDashboardProps) => {
  const summary = executiveDashboard?.executive_summary;
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Dashboard</CardTitle>
        <p className="text-sm text-muted-foreground">
          High-level performance metrics and KPIs
          {summary?.overview?.report_period && (
            <span className="block mt-1">
              Report Period: {summary.overview.report_period}
            </span>
          )}
        </p>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{summary.key_metrics.total_conversations || 0}</div>
                <div className="text-sm text-muted-foreground">Total Conversations</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{summary.key_metrics.unique_users || 0}</div>
                <div className="text-sm text-muted-foreground">Unique Users</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{summary.key_metrics.avg_response_time || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{summary.key_metrics.user_satisfaction || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">User Satisfaction</div>
              </div>
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded">
                <div className="text-xl font-bold text-indigo-600">{summary.key_metrics.resolution_rate || '0%'}</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded">
                <div className="text-xl font-bold text-teal-600">{summary.key_metrics.accessibility_score || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Accessibility Score</div>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded">
                <div className="text-xl font-bold text-rose-600">{summary.key_metrics.cost_per_interaction || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Cost Per Interaction</div>
              </div>
            </div>

            {/* Trends Section */}
            {summary.trends && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded">
                      <span className="text-sm font-medium">Response Time:</span>
                      <Badge
                        variant={
                          summary.trends.response_time_trend === 'improving' ? 'default' :
                          summary.trends.response_time_trend === 'declining' ? 'destructive' : 'secondary'
                        }
                      >
                        {summary.trends.response_time_trend}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded">
                      <span className="text-sm font-medium">Volume:</span>
                      <Badge
                        variant={
                          summary.trends.volume_trend === 'increasing' ? 'default' :
                          summary.trends.volume_trend === 'decreasing' ? 'destructive' : 'secondary'
                        }
                      >
                        {summary.trends.volume_trend}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded">
                      <span className="text-sm font-medium">Satisfaction:</span>
                      <Badge
                        variant={
                          summary.trends.satisfaction_trend === 'improving' ? 'default' :
                          summary.trends.satisfaction_trend === 'declining' ? 'destructive' : 'secondary'
                        }
                      >
                        {summary.trends.satisfaction_trend}
                      </Badge>
                    </div>
                  </div>
                  {summary.trends.summary && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-blue-700">
                        <strong>Summary:</strong> {summary.trends.summary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {summary.recommendations && summary.recommendations.length > 0 && (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Strategic Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Insights */}
            {summary.top_insights && summary.top_insights.length > 0 && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {summary.top_insights.map((insight, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-green-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Indicators */}
            {summary.risk_indicators && summary.risk_indicators.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {summary.risk_indicators.map((risk, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-red-100 rounded">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-800">{risk}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report Info */}
            {summary.overview && summary.overview.generated_at && (
              <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                Generated at: {new Date(summary.overview.generated_at).toLocaleString()}
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