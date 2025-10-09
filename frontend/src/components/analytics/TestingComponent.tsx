import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2} from "lucide-react";
import {
    assignTestVariant,
    getABTestResults,
    recordABTestResult,
    setupABTest,
    deleteABTest,
    pauseABTest,
    resumeABTest,
    completeABTest,
    bulkRecordABTestResults,
    getABTestPerformanceComparison
} from "@/services/tracey";
import { useState, useEffect } from "react";
import { HeaderAction } from "./AB-Test/HeaderAction";
import { TestOverview } from "./AB-Test/TestOverview";
import { AllTests } from "./AB-Test/AllTests";
import { CurrentTests } from "./AB-Test/CurrentTests";
import { PerformanceComparision } from "./AB-Test/PerformanceComparision";
import { DialogueTesting } from "./AB-Test/DialogueTesting";
import { ABTestResults } from "./AB-Test/ABResults";

type VariantPerformance = {
    sample_size: number;
    avg_response_time: number;
    avg_satisfaction: number;
    conversion_rate: number;
};

type ABTestResults = {
    statistical_significance: boolean;
    confidence_level: number; // 0-1 arası
    winner?: "A" | "B";
    variant_a_performance?: VariantPerformance;
    variant_b_performance?: VariantPerformance;
};

type TestingComponentProps = {
    currentTestId?: string;
    setCurrentTestId: (id: string) => void;
    loading: boolean;
    abTestResults?: ABTestResults;
    setAbTestResults: (results: ABTestResults) => void;
    fetchAllData: () => void;
    // Ana fetch'ten gelen yeni data
    allTests?: any;
    dialogueAnomalies?: any;
    statisticalData?: any;
    performanceTrends?: any;
};

export const TestingComponent = ({
    currentTestId,
    setCurrentTestId,
    loading,
    abTestResults,
    setAbTestResults,
    fetchAllData,
    allTests,
    dialogueAnomalies,
    statisticalData,
    performanceTrends
}: TestingComponentProps) => {
    const [performanceComparison, setPerformanceComparison] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Performance comparison'ı currentTestId değiştiğinde güncelle
    useEffect(() => {
        if (currentTestId && abTestResults) {
            loadPerformanceComparison();
        }
    }, [currentTestId, abTestResults]);

    const loadPerformanceComparison = async () => {
        if (!currentTestId) return;

        try {
            const comparison = await getABTestPerformanceComparison(currentTestId);
            setPerformanceComparison(comparison);
        } catch (error) {
            console.error('Error loading performance comparison:', error);
        }
    };

    const recordTestResult = async (variant: string, responseTime: number, satisfaction: number) => {
        if (!currentTestId) {
            console.error('No active test ID');
            return;
        }

        const resultData = {
            test_id: currentTestId,
            session_id: `session_${Date.now()}`,
            variant: variant,
            response_time: responseTime,
            satisfaction: satisfaction,
            conversion: satisfaction > 3.5
        };

        try {
            setActionLoading(`record-${variant}`);
            await recordABTestResult(resultData);
            console.log('Test result recorded:', resultData);

            const updatedResults = await getABTestResults(currentTestId);
            setAbTestResults(updatedResults);

            await loadPerformanceComparison();
        } catch (error) {
            console.error('Error recording test result:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const simulateTestData = async () => {
        if (!currentTestId) {
            console.error('No active test to simulate data for');
            return;
        }

        try {
            setActionLoading('simulate');
            const variants = ['A', 'B'];
            const bulkResults = [];

            for (let i = 0; i < 20; i++) {
                const variant = variants[Math.floor(Math.random() * variants.length)];
                const responseTime = Math.random() * 4 + 1; // 1-5 seconds
                const satisfaction = Math.random() * 2 + 3; // 3-5 rating

                bulkResults.push({
                    session_id: `bulk_session_${Date.now()}_${i}`,
                    variant: variant,
                    response_time: parseFloat(responseTime.toFixed(2)),
                    satisfaction: parseFloat(satisfaction.toFixed(1)),
                    conversion: satisfaction > 3.5
                });
            }

            await bulkRecordABTestResults(currentTestId, bulkResults);
            console.log('Bulk test data recorded:', bulkResults.length, 'results');

            // Ana fetch'i çağır
            fetchAllData();
        } catch (error) {
            console.error('Error simulating test data:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const assignVariant = async (testId: string, variant: string) => {
        try {
            setActionLoading(`assign-${variant}`);
            const sessionId = `session_${Date.now()}`;
            const result = await assignTestVariant(testId, sessionId);
            console.log('Variant assigned:', result);

            await recordTestResult(variant, Math.random() * 3 + 1, Math.random() * 2 + 3);
        } catch (error) {
            console.error('Error assigning variant:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const createNewABTest = async () => {
        const testConfig = {
            test_name: `Response Variant Test ${Date.now()}`,
            variant_a: "Standard Response",
            variant_b: "Enhanced Response",
            traffic_split: 0.5,
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            target_metric: "satisfaction",
            minimum_sample_size: 50,
            confidence_level: 0.95
        };

        try {
            setActionLoading('create');
            const result = await setupABTest(testConfig);

            if (result.test_id) {
                setCurrentTestId(result.test_id);
                const testResults = await getABTestResults(result.test_id);
                setAbTestResults(testResults);
            }

            // Ana fetch'i çağır
            fetchAllData();
        } catch (error) {
            console.error('Error creating A/B test:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleTestStatusUpdate = async (testId: string, status: "active" | "paused" | "completed") => {
        try {
            setActionLoading(`status-${status}`);

            if (status === "paused") {
                await pauseABTest(testId);
            } else if (status === "active") {
                await resumeABTest(testId);
            } else if (status === "completed") {
                await completeABTest(testId);
            }

            if (testId === currentTestId) {
                const updatedResults = await getABTestResults(testId);
                setAbTestResults(updatedResults);
            }

            // Ana fetch'i çağır
            fetchAllData();
        } catch (error) {
            console.error('Error updating test status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteTest = async (testId: string) => {
        if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading('delete');
            await deleteABTest(testId);

            if (testId === currentTestId) {
                setCurrentTestId('');
                setAbTestResults(undefined);
                setPerformanceComparison(null);
            }

            // Ana fetch'i çağır
            fetchAllData();
        } catch (error) {
            console.error('Error deleting test:', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {/* Loading Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="h-8 bg-gray-200 rounded w-80 animate-pulse"></div>
                    <div className="flex flex-wrap gap-2">
                        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                </div>

                {/* Loading Test Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse text-center p-4 bg-gray-50 rounded">
                            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                        </div>
                    ))}
                </div>

                {/* Loading Current Test Status */}
                <Card>
                    <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <HeaderAction
                createNewABTest={createNewABTest}
                simulateTestData={simulateTestData}
                currentTestId={currentTestId}
                actionLoading={actionLoading}
            />

            {/* Test Overview Dashboard */}
            <TestOverview allTests={allTests} dialogueAnomalies={dialogueAnomalies} />

            {/* All Tests List */}
            <AllTests
                allTests={allTests}
                currentTestId={currentTestId}
                setCurrentTestId={setCurrentTestId}
                handleTestStatusUpdate={handleTestStatusUpdate}
                handleDeleteTest={handleDeleteTest}
                actionLoading={actionLoading}
            />

            {/* Current Test Status */}
            <CurrentTests
                currentTestId={currentTestId}
                handleTestStatusUpdate={handleTestStatusUpdate}
                actionLoading={actionLoading}
                assignVariant={assignVariant}
            />

            {/* Performance Comparison */}
            {performanceComparison && (
                <PerformanceComparision performanceComparison={performanceComparison} />
            )}

            {/* A/B Test Results */}
            {abTestResults && (
                <ABTestResults
                    abTestResults={abTestResults}
                    recordTestResult={recordTestResult}
                    actionLoading={actionLoading}
                />
            )}

            {/* Dialogue Testing Analytics */}
            {(statisticalData || performanceTrends) && (
                <DialogueTesting statisticalData={statisticalData} performanceTrends={performanceTrends} />
            )}
        </div>
    );
};