import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    detectDialogueAnomalies,
    getStatisticalDialogueTesting,
    getPerformanceTrends,
    getABTestResults,
    getExecutiveDashboard,
    getCrossPlatformPerformance
} from "@/services/tracey";
import { SessionMetricsComponent } from "./SessionMetrics";
import { HeatMap } from "./Heatmap";
import { UserSegmentationComponent } from "./UserSegmentation";
import { ExportComponent } from "./ExportComponent";
import { CrossPlatformComponent } from "./CrossPlatfromComponent";
import { ExecutiveSummaryComponent } from "./ExecutiveSummaryComponent";
import { OverviewComponent } from "./OverviewComponent";
import { AnomaliesComponent } from "./AnomaliesComponent";
import { StatisticsComponent } from "./StatisticsComponent";
import { TrendsComponent } from "./TrendsComponent";
import { TestingComponent } from "./TestingComponent";

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
    
    return (
        <div className="max-w-full mx-auto space-y-6 p-4 md:p-6">
            {/* Dashboard Header */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">Bot Analytics Dashboard</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    Comprehensive analytics for the FingerTrace AI assistant Tracey
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-1 sm:gap-2 overflow-x-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="executive">Executive</TabsTrigger>
                    <TabsTrigger value="cross-platform">Platforms</TabsTrigger>
                    <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="testing">Testing</TabsTrigger>
                    <TabsTrigger value="session-metrics">Session Metrics</TabsTrigger>
                    <TabsTrigger value="heat-map">Heat Map</TabsTrigger>
                    <TabsTrigger value="user-segmentation">User Segmentation</TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="overview" className="space-y-4">
                    <OverviewComponent
                        fetchAllData={fetchAllData}
                        loading={loading}
                        executiveDashboard={executiveDashboard}
                        crossPlatformData={crossPlatformData}
                        anomalies={anomalies}
                        statistical={statistical}
                    />
                </TabsContent>

                <TabsContent value="executive" className="space-y-4">
                    <ExecutiveSummaryComponent executiveDashboard={executiveDashboard} />
                </TabsContent>

                <TabsContent value="cross-platform" className="space-y-4">
                    <CrossPlatformComponent crossPlatformData={crossPlatformData} />
                </TabsContent>

                <TabsContent value="anomalies" className="space-y-4">
                    <AnomaliesComponent anomalies={anomalies} />
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                    <StatisticsComponent statistical={statistical} />
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <TrendsComponent trends={trends} />
                </TabsContent>

                <TabsContent value="testing" className="space-y-4">
                    <TestingComponent
                        currentTestId={currentTestId}
                        setCurrentTestId={setCurrentTestId}
                        loading={loading}
                        abTestResults={abTestResults}
                        setAbTestResults={setAbTestResults}
                        fetchAllData={fetchAllData}
                    />
                </TabsContent>

                <TabsContent value="session-metrics" className="space-y-4">
                    <SessionMetricsComponent />
                </TabsContent>

                <TabsContent value="heat-map" className="space-y-4">
                    <HeatMap />
                </TabsContent>

                <TabsContent value="user-segmentation" className="space-y-4">
                    <UserSegmentationComponent />
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                    <ExportComponent />
                </TabsContent>
            </Tabs>
        </div>
    );
};