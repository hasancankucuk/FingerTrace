import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge"

export const DialogueTesting = ({ statisticalData, performanceTrends }: any) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dialogue Performance Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Statistical analysis and performance trends
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Performance Stats */}
                    {statisticalData?.response_time_stats && (
                        <div>
                            <h5 className="font-medium mb-2">Response Time Statistics</h5>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                <div className="text-center p-2 bg-blue-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.mean.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Mean</div>
                                </div>
                                <div className="text-center p-2 bg-green-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.median.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Median</div>
                                </div>
                                <div className="text-center p-2 bg-yellow-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.std.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Std Dev</div>
                                </div>
                                <div className="text-center p-2 bg-purple-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.min.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Min</div>
                                </div>
                                <div className="text-center p-2 bg-red-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.max.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Max</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trend Analysis */}
                    {performanceTrends && (
                        <div>
                            <h5 className="font-medium mb-2">Performance Trend</h5>
                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                                <Badge variant={
                                    performanceTrends.trend_direction === 'improving' ? 'default' :
                                        performanceTrends.trend_direction === 'declining' ? 'destructive' : 'secondary'
                                }>
                                    {performanceTrends.trend_direction}
                                </Badge>
                                <span className="text-sm">
                                    Recent: {performanceTrends.recent_performance?.toFixed(2)}s
                                </span>
                                <span className="text-sm">
                                    Change: {performanceTrends.improvement_percentage > 0 ? '+' : ''}
                                    {performanceTrends.improvement_percentage?.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}