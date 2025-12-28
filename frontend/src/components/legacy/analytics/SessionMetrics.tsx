import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionMetrics } from "@/models/AnalysisInterfaces";

interface SessionMetricsProps {
    metrics: SessionMetrics | null;
    loading: boolean;
}

export const SessionMetricsComponent: React.FC<SessionMetricsProps> = ({ metrics, loading }) => {

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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Session Metrics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.total_sessions || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.avg_session_duration?.toFixed(1) || 0} min</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.total_messages || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.avg_response_time?.toFixed(2) || 0} s</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{metrics?.active_users || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Intents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {metrics?.top_intents &&
                                Object.entries(metrics.top_intents).map(([intent, count]) => (
                                    <div key={intent} className="flex justify-between items-center">
                                        <span className="text-sm">{intent}</span>
                                        <Badge variant="secondary">{count}</Badge>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};