import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Monitor, Users } from "lucide-react";

interface OverviewComponentProps {
    fetchAllData: () => void;
    loading: boolean;
    executiveDashboard: any;
    crossPlatformData: any;
    anomalies: any;
    statistical: any;
}

export const OverviewComponent = ({ fetchAllData, loading, executiveDashboard, crossPlatformData, anomalies, statistical }: OverviewComponentProps) => {
    
    const getPerformanceScore = () => {
        if (!statistical?.response_time_stats) return 0;

        const avgResponseTime = statistical.response_time_stats.mean;
        if (avgResponseTime <= 2) return 100;
        if (avgResponseTime <= 5) return Math.max(50, 100 - ((avgResponseTime - 2) * 16.67));
        return Math.max(0, 50 - ((avgResponseTime - 5) * 10));
    };


    const getHealthStatus = () => {
        const performanceScore = getPerformanceScore();
        const anomalyCount = anomalies?.total_anomalies || 0;

        if (performanceScore > 80 && anomalyCount === 0) return 'Excellent';
        if (performanceScore > 60 && anomalyCount < 3) return 'Good';
        if (performanceScore > 40 && anomalyCount < 5) return 'Fair';
        return 'Poor';
    };

    return (
        <>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analytics Overview</h2>
                <Button onClick={fetchAllData} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {executiveDashboard?.executive_summary?.key_metrics?.total_conversations || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All time sessions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Platforms</CardTitle>
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {crossPlatformData?.cross_platform_analysis ?
                                Object.keys(crossPlatformData.cross_platform_analysis).length : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Platform count
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {anomalies?.total_anomalies || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Detected issues
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {executiveDashboard?.executive_summary?.key_metrics?.avg_response_time ||
                                statistical?.response_time_stats?.mean?.toFixed(2) + 's' || '0s'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Mean response time
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Performance Score</span>
                                    <span>{getPerformanceScore().toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${getPerformanceScore() > 80 ? 'bg-green-600' :
                                            getPerformanceScore() > 60 ? 'bg-yellow-600' : 'bg-red-600'
                                            }`}
                                        style={{ width: `${getPerformanceScore()}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>User Satisfaction</span>
                                    <span>{executiveDashboard?.executive_summary?.key_metrics?.user_satisfaction || 'N/A'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                            width: `${executiveDashboard?.executive_summary?.key_metrics?.user_satisfaction ?
                                                (parseFloat(executiveDashboard.executive_summary.key_metrics.user_satisfaction.split('/')[0]) / 5 * 100) : 0}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Accessibility Score</span>
                                    <span>{executiveDashboard?.executive_summary?.key_metrics?.accessibility_score || 'N/A'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{
                                            width: `${executiveDashboard?.executive_summary?.key_metrics?.accessibility_score ?
                                                parseFloat(executiveDashboard.executive_summary.key_metrics.accessibility_score.replace('%', '')) : 0}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>System Status:</span>
                                <Badge variant={getHealthStatus() === 'Excellent' ? "default" : "secondary"}>
                                    {getHealthStatus()}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Response Time Trend:</span>
                                <Badge variant={
                                    executiveDashboard?.executive_summary?.trends?.response_time_trend === 'improving' ? "default" :
                                        executiveDashboard?.executive_summary?.trends?.response_time_trend === 'declining' ? "destructive" : "secondary"
                                }>
                                    {executiveDashboard?.executive_summary?.trends?.response_time_trend || 'Stable'}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Volume Trend:</span>
                                <Badge variant={
                                    executiveDashboard?.executive_summary?.trends?.volume_trend === 'increasing' ? "default" :
                                        executiveDashboard?.executive_summary?.trends?.volume_trend === 'decreasing' ? "destructive" : "secondary"
                                }>
                                    {executiveDashboard?.executive_summary?.trends?.volume_trend || 'Stable'}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Active Issues:</span>
                                <Badge variant={(anomalies?.total_anomalies || 0) > 0 ? "destructive" : "default"}>
                                    {(anomalies?.total_anomalies || 0)} Issues
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Resolution Rate:</span>
                                <Badge variant="outline">
                                    {executiveDashboard?.executive_summary?.key_metrics?.resolution_rate || '0%'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}