import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    detectDialogueAnomalies,
    getStatisticalDialogueTesting,
    getPerformanceTrends,
    getABTestResults,
    getExecutiveDashboard,
    getCrossPlatformPerformance,
    getSessionMetrics,
    getSessionHeatMap,
    listAllABTests,
    getUserSegmentation
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
import { Button } from "../ui/button";
import type { SessionMetrics, UserSegmentation } from "@/models/AnalysisInterfaces";

export const BotAnalytics = () => {
    const [anomalies, setAnomalies] = useState<any>(null);
    const [statistical, setStatistical] = useState<any>(null);
    const [trends, setTrends] = useState<any>(null);
    const [executiveDashboard, setExecutiveDashboard] = useState<any>(null);
    const [crossPlatformData, setCrossPlatformData] = useState<any>(null);
    const [abTestResults, setAbTestResults] = useState<any>(null);
    const [currentTestId, setCurrentTestId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState<SessionMetrics | null>(null);
    const [heatmap, setHeatmap] = useState<{ heatmap: string } | null>(null);
    const [allTests, setAllTests] = useState<any>(null);
    const [segmentation, setSegmentation] = useState<UserSegmentation | null>(null);
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
                crossPlatformResult,
                metricsResult,
                heatMapResult,
                segmentationResult,
                allTestsResult,
            ] = await Promise.all([
                detectDialogueAnomalies(),
                getStatisticalDialogueTesting(),
                getPerformanceTrends(),
                getExecutiveDashboard(),
                getCrossPlatformPerformance(),
                getSessionMetrics(),
                getSessionHeatMap(),
                getUserSegmentation(),
                listAllABTests().catch(() => null)
            ]);

            setAnomalies(anomaliesResult);
            setStatistical(statisticalResult);
            setTrends(trendsResult);
            setExecutiveDashboard(executiveResult);
            setCrossPlatformData(crossPlatformResult);
            setMetrics(metricsResult)
            setHeatmap(heatMapResult);
            setAllTests(allTestsResult);
            setSegmentation(segmentationResult);

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
                <div className="overflow-x-auto">
                    <TabsList className="flex flex-nowrap min-w-max gap-1 p-1 bg-muted rounded-lg">
                        <TabsTrigger value="overview" className="whitespace-nowrap px-4 py-2 min-w-fit">Overview</TabsTrigger>
                        <TabsTrigger value="executive" className="whitespace-nowrap px-4 py-2 min-w-fit">Executive</TabsTrigger>
                        <TabsTrigger value="cross-platform" className="whitespace-nowrap px-4 py-2 min-w-fit">Platforms</TabsTrigger>
                        <TabsTrigger value="anomalies" className="whitespace-nowrap px-4 py-2 min-w-fit">Anomalies</TabsTrigger>
                        <TabsTrigger value="statistics" className="whitespace-nowrap px-4 py-2 min-w-fit">Statistics</TabsTrigger>
                        <TabsTrigger value="trends" className="whitespace-nowrap px-4 py-2 min-w-fit">Trends</TabsTrigger>
                        <TabsTrigger value="testing" className="whitespace-nowrap px-4 py-2 min-w-fit">Testing</TabsTrigger>
                        <TabsTrigger value="session-metrics" className="whitespace-nowrap px-4 py-2 min-w-fit">Session Metrics</TabsTrigger>
                        <TabsTrigger value="heat-map" className="whitespace-nowrap px-4 py-2 min-w-fit">Heat Map</TabsTrigger>
                        <TabsTrigger value="user-segmentation" className="whitespace-nowrap px-4 py-2 min-w-fit">User Segmentation</TabsTrigger>
                    </TabsList>
                </div>



                <div className="flex justify-end items-end">
                    <Button onClick={fetchAllData} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>
                </div>
                {/* Tab Contents */}
                <TabsContent value="overview" className="space-y-4">
                    <OverviewComponent
                        loading={loading}
                        executiveDashboard={executiveDashboard}
                        crossPlatformData={crossPlatformData}
                        anomalies={anomalies}
                        statistical={statistical}
                    />
                </TabsContent>

                <TabsContent value="executive" className="space-y-4">
                    <ExecutiveSummaryComponent
                        executiveDashboard={executiveDashboard}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="cross-platform" className="space-y-4">
                    <CrossPlatformComponent
                        crossPlatformData={crossPlatformData}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="anomalies" className="space-y-4">
                    <AnomaliesComponent
                        anomalies={anomalies}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                    <StatisticsComponent
                        statistical={statistical}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <TrendsComponent
                        trends={trends}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="testing" className="space-y-4">
                    <TestingComponent
                        currentTestId={currentTestId}
                        setCurrentTestId={setCurrentTestId}
                        loading={loading}
                        abTestResults={abTestResults}
                        setAbTestResults={setAbTestResults}
                        fetchAllData={fetchAllData}
                        allTests={allTests}
                        dialogueAnomalies={anomalies}
                        statisticalData={statistical}
                        performanceTrends={trends}
                    />
                </TabsContent>

                <TabsContent value="session-metrics" className="space-y-4">
                    <SessionMetricsComponent
                        metrics={metrics}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="heat-map" className="space-y-4">
                    <HeatMap
                        data={heatmap}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="user-segmentation" className="space-y-4">
                    <UserSegmentationComponent
                        segmentation={segmentation}
                        loading={loading}
                     />
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                    <ExportComponent />
                </TabsContent>
            </Tabs>
        </div>
    );
};