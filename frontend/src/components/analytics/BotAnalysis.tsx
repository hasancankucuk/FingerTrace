import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    setupABTest,
    recordABTestResult,
    detectDialogueAnomalies, 
    getStatisticalDialogueTesting, 
    getPerformanceTrends,
    getABTestResults,
    assignTestVariant,
    getExecutiveDashboard,
    getCrossPlatformPerformance 
} from "@/services/tracey";
import { AlertTriangle, Activity, Monitor, Users, TestTube, Play } from "lucide-react";

export const BotAnalytics = () => {
    const [anomalies, setAnomalies] = useState<any>(null);
    const [statistical, setStatistical] = useState<any>(null);
    const [trends, setTrends] = useState<any>(null);
    const [executiveDashboard, setExecutiveDashboard] = useState<any>(null);
    const [crossPlatformData, setCrossPlatformData] = useState<any>(null);
    const [abTestResults, setAbTestResults] = useState<any>(null);
    const [currentTestId, setCurrentTestId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [
                anomaliesResult, 
                statisticalResult, 
                trendsResult, 
                executiveResult, 
                crossPlatformResult
            ] = await Promise.all([
                detectDialogueAnomalies(),
                getStatisticalDialogueTesting(),
                getPerformanceTrends(),
                getExecutiveDashboard(),
                getCrossPlatformPerformance()
            ]);
            
            setAnomalies(anomaliesResult);
            setStatistical(statisticalResult);
            setTrends(trendsResult);
            setExecutiveDashboard(executiveResult);
            setCrossPlatformData(crossPlatformResult);

            if (currentTestId) {
                const testResults = await getABTestResults(currentTestId);
                setAbTestResults(testResults);
            }
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceScore = () => {
        if (!statistical?.response_time_stats) return 0;
        
        const avgResponseTime = statistical.response_time_stats.mean;
        if (avgResponseTime <= 2) return 100;
        if (avgResponseTime <= 5) return Math.max(50, 100 - ((avgResponseTime - 2) * 16.67));
        return Math.max(0, 50 - ((avgResponseTime - 5) * 10));
    };

    const getDataCompleteness = () => {
        if (!statistical || !anomalies || !trends) return 0;
        
        let completeness = 0;
        if (statistical?.response_time_stats) completeness += 25;
        if (anomalies?.total_anomalies !== undefined) completeness += 25;
        if (trends?.trend_direction) completeness += 25;
        if (executiveDashboard) completeness += 25;
        
        return completeness;
    };

    const getHealthStatus = () => {
        const performanceScore = getPerformanceScore();
        const anomalyCount = anomalies?.total_anomalies || 0;
        
        if (performanceScore > 80 && anomalyCount === 0) return 'Excellent';
        if (performanceScore > 60 && anomalyCount < 3) return 'Good';
        if (performanceScore > 40 && anomalyCount < 5) return 'Fair';
        return 'Poor';
    };

    const createNewABTest = async () => {
        const testConfig = {
            test_name: "Response Variant Test",
            variant_a: "Standard Response",
            variant_b: "Enhanced Response",
            traffic_split: 0.5,
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };

        try {
            const result = await setupABTest(testConfig);
            console.log('A/B Test created:', result);
            
            if (result.test_id) {
                setCurrentTestId(result.test_id);
                // Yeni test oluşturulduktan sonra sonuçları getir
                const testResults = await getABTestResults(result.test_id);
                setAbTestResults(testResults);
            }
            
            fetchAllData();
        } catch (error) {
            console.error('Error creating A/B test:', error);
        }
    };

    const recordTestResult = async (variant: string, responseTime: number, satisfaction: number) => {
        if (!currentTestId) {
            console.error('No active test ID');
            return;
        }

        const resultData = {
            test_id: currentTestId,
            session_id: `session_${Date.now()}`, // Generate session ID
            variant: variant,
            response_time: responseTime,
            satisfaction: satisfaction,
            conversion: satisfaction > 3.5 // Consider high satisfaction as conversion
        };

        try {
            await recordABTestResult(resultData);
            console.log('Test result recorded:', resultData);
            
            // Sonuç kaydedildikten sonra test sonuçlarını güncelle
            const updatedResults = await getABTestResults(currentTestId);
            setAbTestResults(updatedResults);
        } catch (error) {
            console.error('Error recording test result:', error);
        }
    };

    const simulateTestData = async () => {
        if (!currentTestId) {
            console.error('No active test to simulate data for');
            return;
        }

        // Simulate some test data
        const variants = ['A', 'B'];
        const promises = [];

        for (let i = 0; i < 10; i++) {
            const variant = variants[Math.floor(Math.random() * variants.length)];
            const responseTime = Math.random() * 5 + 1; // 1-6 seconds
            const satisfaction = Math.random() * 2 + 3; // 3-5 rating
            
            promises.push(recordTestResult(variant, responseTime, satisfaction));
        }

        await Promise.all(promises);
        console.log('Simulated test data recorded');
    };

    const assignVariant = async (testId: string, variant: string) => {
        try {
            const sessionId = `session_${Date.now()}`;
            const result = await assignTestVariant(testId, sessionId);
            console.log('Variant assigned:', result);
            
            // Assign sonrası otomatik olarak bir test sonucu kaydet
            await recordTestResult(variant, Math.random() * 3 + 1, Math.random() * 2 + 3);
        } catch (error) {
            console.error('Error assigning variant:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Bot Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                    Comprehensive analytics for the FingerTrace AI assistant Tracey
                </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="executive">Executive</TabsTrigger>
                    <TabsTrigger value="cross-platform">Platforms</TabsTrigger>
                    <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="testing">Testing</TabsTrigger>
                </TabsList>

                <TabsContent value="executive" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Executive Dashboard</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                High-level performance metrics and KPIs
                                {executiveDashboard?.executive_summary?.overview?.report_period && (
                                    <span className="block mt-1">
                                        Report Period: {executiveDashboard.executive_summary.overview.report_period}
                                    </span>
                                )}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {executiveDashboard?.executive_summary ? (
                                <div className="space-y-6">
                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {executiveDashboard.executive_summary.key_metrics.total_conversations || 0}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total Conversations</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded">
                                            <div className="text-2xl font-bold text-green-600">
                                                {executiveDashboard.executive_summary.key_metrics.unique_users || 0}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Unique Users</div>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {executiveDashboard.executive_summary.key_metrics.avg_response_time || 'N/A'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Avg Response Time</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {executiveDashboard.executive_summary.key_metrics.user_satisfaction || 'N/A'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">User Satisfaction</div>
                                        </div>
                                    </div>

                                    {/* Additional Metrics Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-indigo-50 rounded">
                                            <div className="text-xl font-bold text-indigo-600">
                                                {executiveDashboard.executive_summary.key_metrics.resolution_rate || '0%'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Resolution Rate</div>
                                        </div>
                                        <div className="text-center p-4 bg-teal-50 rounded">
                                            <div className="text-xl font-bold text-teal-600">
                                                {executiveDashboard.executive_summary.key_metrics.accessibility_score || 'N/A'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Accessibility Score</div>
                                        </div>
                                        <div className="text-center p-4 bg-rose-50 rounded">
                                            <div className="text-xl font-bold text-rose-600">
                                                {executiveDashboard.executive_summary.key_metrics.cost_per_interaction || 'N/A'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Cost Per Interaction</div>
                                        </div>
                                    </div>

                                    {/* Trends Section */}
                                    {executiveDashboard.executive_summary.trends && (
                                        <Card className="bg-gray-50">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Performance Trends</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center justify-between p-3 bg-white rounded">
                                                        <span className="text-sm font-medium">Response Time:</span>
                                                        <Badge variant={
                                                            executiveDashboard.executive_summary.trends.response_time_trend === 'improving' ? 'default' :
                                                            executiveDashboard.executive_summary.trends.response_time_trend === 'declining' ? 'destructive' : 'secondary'
                                                        }>
                                                            {executiveDashboard.executive_summary.trends.response_time_trend}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-white rounded">
                                                        <span className="text-sm font-medium">Volume:</span>
                                                        <Badge variant={
                                                            executiveDashboard.executive_summary.trends.volume_trend === 'increasing' ? 'default' :
                                                            executiveDashboard.executive_summary.trends.volume_trend === 'decreasing' ? 'destructive' : 'secondary'
                                                        }>
                                                            {executiveDashboard.executive_summary.trends.volume_trend}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-white rounded">
                                                        <span className="text-sm font-medium">Satisfaction:</span>
                                                        <Badge variant={
                                                            executiveDashboard.executive_summary.trends.satisfaction_trend === 'improving' ? 'default' :
                                                            executiveDashboard.executive_summary.trends.satisfaction_trend === 'declining' ? 'destructive' : 'secondary'
                                                        }>
                                                            {executiveDashboard.executive_summary.trends.satisfaction_trend}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {executiveDashboard.executive_summary.trends.summary && (
                                                    <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                                                        <p className="text-sm text-blue-700">
                                                            <strong>Summary:</strong> {executiveDashboard.executive_summary.trends.summary}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Recommendations */}
                                    {executiveDashboard.executive_summary.recommendations && executiveDashboard.executive_summary.recommendations.length > 0 && (
                                        <Card className="border-blue-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-blue-800">Strategic Recommendations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {executiveDashboard.executive_summary.recommendations.map((recommendation: string, index: number) => (
                                                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                                                            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-sm text-blue-800">{recommendation}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Top Insights */}
                                    {executiveDashboard.executive_summary.top_insights && executiveDashboard.executive_summary.top_insights.length > 0 && (
                                        <Card className="border-green-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-green-800">Key Insights</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {executiveDashboard.executive_summary.top_insights.map((insight: string, index: number) => (
                                                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <p className="text-sm text-green-800">{insight}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Risk Indicators */}
                                    {executiveDashboard.executive_summary.risk_indicators && executiveDashboard.executive_summary.risk_indicators.length > 0 && (
                                        <Card className="border-red-200 bg-red-50">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                                                    <AlertTriangle className="h-5 w-5" />
                                                    Risk Indicators
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {executiveDashboard.executive_summary.risk_indicators.map((risk: string, index: number) => (
                                                        <div key={index} className="flex items-center gap-2 p-2 bg-red-100 rounded">
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                            <p className="text-sm text-red-800">{risk}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Report Info */}
                                    {executiveDashboard.executive_summary.overview && (
                                        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                                            Generated at: {new Date(executiveDashboard.executive_summary.overview.generated_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="overview" className="space-y-6">
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
                                    {executiveDashboard?.executive_summary?.key_metrics?.total_conversations || 
                                     (crossPlatformData?.cross_platform_analysis ? 
                                        Object.values(crossPlatformData.cross_platform_analysis)
                                            .reduce((total: number, platform: any) => total + platform.sessions, 0) : 0)}
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
                                                className={`h-2 rounded-full ${
                                                    getPerformanceScore() > 80 ? 'bg-green-600' :
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

                    {/* Executive Summary Alert */}
                    {executiveDashboard?.executive_summary?.trends?.summary && (
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-800 flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Executive Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 text-sm">
                                    {executiveDashboard.executive_summary.trends.summary}
                                </p>
                                {executiveDashBoard.executive_summary.recommendations && executiveDashboard.executive_summary.recommendations.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-blue-800 text-sm font-medium mb-2">Key Recommendations:</p>
                                        <ul className="text-blue-700 text-xs space-y-1">
                                            {executiveDashboard.executive_summary.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                                                <li key={idx}>• {rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="overview" className="space-y-6">
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
                                    {executiveDashboard?.executive_summary?.key_metrics?.total_conversations || 
                                     (crossPlatformData?.cross_platform_analysis ? 
                                        Object.values(crossPlatformData.cross_platform_analysis)
                                            .reduce((total: number, platform: any) => total + platform.sessions, 0) : 0)}
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
                                                className={`h-2 rounded-full ${
                                                    getPerformanceScore() > 80 ? 'bg-green-600' :
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

                    {/* Executive Summary Alert */}
                    {executiveDashboard?.executive_summary?.trends?.summary && (
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="text-blue-800 flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Executive Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 text-sm">
                                    {executiveDashboard.executive_summary.trends.summary}
                                </p>
                                {executiveDashBoard.executive_summary.recommendations && executiveDashboard.executive_summary.recommendations.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-blue-800 text-sm font-medium mb-2">Key Recommendations:</p>
                                        <ul className="text-blue-700 text-xs space-y-1">
                                            {executiveDashboard.executive_summary.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                                                <li key={idx}>• {rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="cross-platform" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cross-Platform Performance</CardTitle>
                            <p className="text-sm text-muted-foreground">Performance metrics across different platforms</p>
                        </CardHeader>
                        <CardContent>
                            {crossPlatformData?.cross_platform_analysis ? (
                                <div className="space-y-6">
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {Object.keys(crossPlatformData.cross_platform_analysis).length}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Active Platforms</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded">
                                            <div className="text-2xl font-bold text-green-600">
                                                {Object.values(crossPlatformData.cross_platform_analysis)
                                                    .reduce((total: number, platform: any) => total + platform.sessions, 0)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total Sessions</div>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {(Object.values(crossPlatformData.cross_platform_analysis)
                                                    .reduce((total: number, platform: any) => total + platform.avg_response_time, 0) / 
                                                    Object.values(crossPlatformData.cross_platform_analysis).length).toFixed(2)}s
                                            </div>
                                            <div className="text-sm text-muted-foreground">Avg Response Time</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded">
                                            <div className="text-2xl font-bold text-purple-600 capitalize">
                                                {crossPlatformData.best_performing_platform || 'N/A'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Best Platform</div>
                                        </div>
                                    </div>
                                    
                                    {/* Platform Breakdown */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Platform Performance Breakdown</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {Object.entries(crossPlatformData.cross_platform_analysis).map(([platformName, platform]: [string, any]) => (
                                                <div key={platformName} className="p-4 border rounded-lg space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="font-medium capitalize flex items-center gap-2">
                                                            {platformName === 'web' && <Monitor className="h-4 w-4" />}
                                                            {platformName === 'mobile' && <Users className="h-4 w-4" />}
                                                            {platformName === 'api' && <Activity className="h-4 w-4" />}
                                                            {platformName}
                                                        </h5>
                                                        {crossPlatformData.best_performing_platform === platformName && (
                                                            <Badge variant="default">Best</Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Sessions:</span>
                                                            <span className="font-bold">{platform.sessions}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Avg Response:</span>
                                                            <span className="font-bold">{platform.avg_response_time}s</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Satisfaction:</span>
                                                            <span className="font-bold">{platform.satisfaction}/5</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Conversion:</span>
                                                            <span className="font-bold">{(platform.conversion_rate * 100).toFixed(1)}%</span>
                                                        </div>
                                                    </div>

                                                    {/* Performance Indicators */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Response Time</span>
                                                            <span>{platform.avg_response_time <= 2 ? 'Good' : platform.avg_response_time <= 3 ? 'Fair' : 'Poor'}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div 
                                                                className={`h-1.5 rounded-full ${
                                                                    platform.avg_response_time <= 2 ? 'bg-green-500' :
                                                                    platform.avg_response_time <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ 
                                                                    width: `${Math.max(20, Math.min(100, (5 - platform.avg_response_time) * 20))}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Platform Recommendations */}
                                    {crossPlatformData.platform_recommendations && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Platform Recommendations</h4>
                                            <div className="space-y-3">
                                                {Object.entries(crossPlatformData.platform_recommendations).map(([platform, recommendation]: [string, any]) => (
                                                    <div key={platform} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                {platform === 'web' && <Monitor className="h-5 w-5 text-blue-600 mt-0.5" />}
                                                                {platform === 'mobile' && <Users className="h-5 w-5 text-blue-600 mt-0.5" />}
                                                                {platform === 'api' && <Activity className="h-5 w-5 text-blue-600 mt-0.5" />}
                                                            </div>
                                                            <div>
                                                                <h6 className="font-medium capitalize text-blue-900">{platform} Platform</h6>
                                                                <p className="text-sm text-blue-700 mt-1">{recommendation}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Platform Comparison Chart */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Performance Comparison</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Response Time Comparison */}
                                            <div className="space-y-3">
                                                <h6 className="text-sm font-medium">Response Time Comparison</h6>
                                                {Object.entries(crossPlatformData.cross_platform_analysis).map(([platformName, platform]: [string, any]) => (
                                                    <div key={`rt-${platformName}`} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="capitalize">{platformName}</span>
                                                            <span className="font-bold">{platform.avg_response_time}s</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full ${
                                                                    crossPlatformData.best_performing_platform === platformName ? 'bg-green-500' : 'bg-blue-500'
                                                                }`}
                                                                style={{ 
                                                                    width: `${Math.min(100, (platform.avg_response_time / 5) * 100)}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Satisfaction Comparison */}
                                            <div className="space-y-3">
                                                <h6 className="text-sm font-medium">Satisfaction Comparison</h6>
                                                {Object.entries(crossPlatformData.cross_platform_analysis).map(([platformName, platform]: [string, any]) => (
                                                    <div key={`sat-${platformName}`} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="capitalize">{platformName}</span>
                                                            <span className="font-bold">{platform.satisfaction}/5</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full ${
                                                                    crossPlatformData.best_performing_platform === platformName ? 'bg-green-500' : 'bg-purple-500'
                                                                }`}
                                                                style={{ 
                                                                    width: `${(platform.satisfaction / 5) * 100}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="anomalies" className="space-y-6">
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
                                                {anomalies.response_time_anomalies?.length || 0}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Response Time Anomalies</div>
                                        </div>
                                        <div className="text-center">
                                            <Badge variant={anomalies.intent_drift_detected ? "destructive" : "secondary"}>
                                                {anomalies.intent_drift_detected ? "Drift Detected" : "No Drift"}
                                            </Badge>
                                            <div className="text-sm text-muted-foreground mt-1">Intent Drift Status</div>
                                        </div>
                                    </div>

                                    {/* Anomaly Details */}
                                    {anomalies.response_time_anomalies && anomalies.response_time_anomalies.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-semibold">Recent Anomalies</h4>
                                            {anomalies.response_time_anomalies.slice(0, 5).map((anomaly: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                                                    <div>
                                                        <div className="font-semibold">Session: {anomaly.session_id}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {new Date(anomaly.timestamp).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold">{anomaly.response_time.toFixed(2)}s</div>
                                                        <Badge variant="destructive">Z-Score: {anomaly.z_score.toFixed(2)}</Badge>
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
                </TabsContent>

                <TabsContent value="statistics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistical Analysis</CardTitle>
                            <p className="text-sm text-muted-foreground">Detailed statistical metrics for bot performance</p>
                        </CardHeader>
                        <CardContent>
                            {statistical?.response_time_stats ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold">{statistical.response_time_stats.mean.toFixed(2)}s</div>
                                            <div className="text-sm text-muted-foreground">Mean</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold">{statistical.response_time_stats.median.toFixed(2)}s</div>
                                            <div className="text-sm text-muted-foreground">Median</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold">{statistical.response_time_stats.std.toFixed(2)}s</div>
                                            <div className="text-sm text-muted-foreground">Std Dev</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold">{statistical.response_time_stats.min.toFixed(2)}s</div>
                                            <div className="text-sm text-muted-foreground">Min</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold">{statistical.response_time_stats.max.toFixed(2)}s</div>
                                            <div className="text-sm text-muted-foreground">Max</div>
                                        </div>
                                    </div>

                                    {/* Intent Distribution */}
                                    {statistical.intent_distribution && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Intent Distribution</h4>
                                            <div className="space-y-2">
                                                {Object.entries(statistical.intent_distribution).map(([intent, count]) => (
                                                    <div key={intent} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                        <span className="font-medium capitalize">{intent}</span>
                                                        <Badge variant="outline">{count as number} queries</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Satisfaction Analysis */}
                                    {statistical.satisfaction_analysis && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Response Quality Analysis</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-green-50 rounded">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {(statistical.satisfaction_analysis.fast_response_rate * 100).toFixed(1)}%
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Fast Responses</div>
                                                </div>
                                                <div className="text-center p-4 bg-blue-50 rounded">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {statistical.satisfaction_analysis.avg_fast_response_time.toFixed(2)}s
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Avg Fast Time</div>
                                                </div>
                                                <div className="text-center p-4 bg-orange-50 rounded">
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        {statistical.satisfaction_analysis.avg_slow_response_time.toFixed(2)}s
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
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {trends && (
                                    trends.trend_direction === 'improving' ? 
                                        <div className="h-4 w-4 bg-green-500 rounded-full"></div> :
                                    trends.trend_direction === 'declining' ? 
                                        <div className="h-4 w-4 bg-red-500 rounded-full"></div> :
                                        <div className="h-4 w-4 bg-gray-500 rounded-full"></div>
                                )}
                                Performance Trends
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Long-term performance analysis and trends</p>
                        </CardHeader>
                        <CardContent>
                            {trends ? (
                                <div className="space-y-6">
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
                                                {trends.improvement_percentage > 0 ? '+' : ''}{trends.improvement_percentage?.toFixed(1)}%
                                            </div>
                                            <div className="text-sm text-muted-foreground">Performance Change</div>
                                        </div>
                                    </div>

                                    {/* Moving Averages */}
                                    {trends.moving_averages && trends.moving_averages.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-3">Recent Performance Trend</h4>
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {trends.moving_averages.slice(-10).map((point: any, index: number) => (
                                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
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
                </TabsContent>

                <TabsContent value="testing" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">A/B Testing & Performance Analysis</h2>
                        <div className="space-x-2">
                            <Button onClick={createNewABTest} variant="outline">
                                <TestTube className="h-4 w-4 mr-2" />
                                Create A/B Test
                            </Button>
                            <Button onClick={simulateTestData} variant="outline" disabled={!currentTestId}>
                                <Play className="h-4 w-4 mr-2" />
                                Simulate Data
                            </Button>
                            <Button onClick={fetchAllData} disabled={loading}>
                                {loading ? 'Refreshing...' : 'Refresh Data'}
                            </Button>
                        </div>
                    </div>

                    {/* Current Test Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current A/B Test Status</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Active test: {currentTestId ? `Test ID: ${currentTestId}` : 'No active test'}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {currentTestId ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="default">Active</Badge>
                                        <span className="text-sm">Response Variant Test</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => assignVariant(currentTestId, 'A')}
                                        >
                                            Test Variant A
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => assignVariant(currentTestId, 'B')}
                                        >
                                            Test Variant B
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    No active A/B test. Create one to start testing.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    
                    {/* A/B Test Results */}
                    {abTestResults && (
                        <Card>
                            <CardHeader>
                                <CardTitle>A/B Test Results</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Statistical analysis of variant performance
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Test Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {abTestResults.statistical_significance ? 'YES' : 'NO'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Statistical Significance</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded">
                                            <div className="text-2xl font-bold text-green-600">
                                                {(abTestResults.confidence_level * 100).toFixed(1)}%
                                            </div>
                                            <div className="text-sm text-muted-foreground">Confidence Level</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {abTestResults.winner || 'TBD'}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Winner</div>
                                        </div>
                                    </div>

                                    {/* Variant Comparison */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Variant Performance Comparison</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Variant A */}
                                            <div className="p-4 border rounded">
                                                <h5 className="font-medium mb-3 flex items-center gap-2">
                                                    Variant A: Standard Response
                                                    {abTestResults.winner === 'A' && (
                                                        <Badge variant="default">Winner</Badge>
                                                    )}
                                                </h5>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Sample Size:</span>
                                                        <span className="font-bold">
                                                            {abTestResults.variant_a_performance?.sample_size || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Response Time:</span>
                                                        <span className="font-bold">
                                                            {abTestResults.variant_a_performance?.avg_response_time?.toFixed(2) || 0}s
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Satisfaction:</span>
                                                        <span className="font-bold">
                                                            {abTestResults.variant_a_performance?.avg_satisfaction?.toFixed(2) || 0}/5
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Conversion Rate:</span>
                                                        <span className="font-bold">
                                                            {((abTestResults.variant_a_performance?.conversion_rate || 0) * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Variant B */}
                                            <div className="p-4 border rounded">
                                                <h5 className="font-medium mb-3 flex items-center gap-2">
                                                    Variant B: Enhanced Response
                                                    {abTestResults.winner === 'B' && (
                                                        <Badge variant="default">Winner</Badge>
                                                    )}
                                                </h5>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Sample Size:</span>
                                                        <span className="font-bold">
                                                            {abTestResults.variant_b_performance?.sample_size || 0}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Response Time:</span>
                                                        <span className="font-bold">
                                                            {abTestResults.variant_b_performance?.avg_response_time?.toFixed(2) || 0}s
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Satisfaction:</span>
                                                        <span className="font-bold">
                                                            {abTestResults.variant_b_performance?.avg_satisfaction?.toFixed(2) || 0}/5
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Conversion Rate:</span>
                                                        <span className="font-bold">
                                                            {((abTestResults.variant_b_performance?.conversion_rate || 0) * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Actions */}
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => recordTestResult('A', 2.5, 4.2)}
                                        >
                                            Record A Result
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={() => recordTestResult('B', 2.1, 4.5)}
                                        >
                                            Record B Result
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ...existing testing content... */}
                </TabsContent>
            </Tabs>
        </div>
    );
};