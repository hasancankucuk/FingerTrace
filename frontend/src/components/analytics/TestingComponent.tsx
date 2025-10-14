import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    abTestResults?: ABTestResults | null;
    setAbTestResults: (results: ABTestResults | null) => void;
    fetchAllData: () => void;
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

    // A/B test creation form state
    const [testName, setTestName] = useState<string>('');
    const [variantA, setVariantA] = useState<string>('Standard Response');
    const [variantB, setVariantB] = useState<string>('Enhanced Response');
    const [trafficSplit, setTrafficSplit] = useState<number>(0.5);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0,10));
    const [endDate, setEndDate] = useState<string>(new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10));
    const [targetMetric, setTargetMetric] = useState<string>('satisfaction');
    const [minimumSampleSize, setMinimumSampleSize] = useState<number>(50);
    const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);

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
        // basic validation
        if (!testName.trim()) {
            alert('Please provide a test name');
            return;
        }

        const testConfig = {
            test_name: testName,
            variant_a: variantA,
            variant_b: variantB,
            traffic_split: Number(trafficSplit),
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            target_metric: targetMetric,
            minimum_sample_size: Number(minimumSampleSize),
            confidence_level: Number(confidenceLevel)
        };

        try {
            setActionLoading('create');
            const result = await setupABTest(testConfig);

            if (result.test_id) {
                setCurrentTestId(result.test_id);
                const testResults = await getABTestResults(result.test_id);
                setAbTestResults(testResults);
            }

            fetchAllData();
            setTestName('');
        } catch (error) {
            console.error('Error creating A/B test:', error);
            alert('Failed to create A/B test');
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
                setAbTestResults(null);
                setPerformanceComparison(null);
            }

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
            {/* A/B Test Creation Form */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Create A/B Test</h3>
                        <div className="text-sm text-muted-foreground">Fill fields and create</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input value={testName} onChange={(e) => setTestName(e.target.value)} className="input" placeholder="Test name" />
                        <input value={variantA} onChange={(e) => setVariantA(e.target.value)} className="input" placeholder="Variant A label" />
                        <input value={variantB} onChange={(e) => setVariantB(e.target.value)} className="input" placeholder="Variant B label" />
                        <input type="number" step="0.01" min={0} max={1} value={trafficSplit} onChange={(e) => setTrafficSplit(parseFloat(e.target.value))} className="input" placeholder="Traffic split (0-1)" />
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
                        <input value={targetMetric} onChange={(e) => setTargetMetric(e.target.value)} className="input" placeholder="Target metric" />
                        <input type="number" value={minimumSampleSize} onChange={(e) => setMinimumSampleSize(Number(e.target.value))} className="input" placeholder="Min sample size" />
                        <input type="number" step="0.01" min={0} max={1} value={confidenceLevel} onChange={(e) => setConfidenceLevel(Number(e.target.value))} className="input" placeholder="Confidence level" />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button onClick={createNewABTest} disabled={actionLoading === 'create'} className="btn">
                            {actionLoading === 'create' ? 'Creating...' : 'Create A/B Test'}
                        </button>
                        <button onClick={simulateTestData} disabled={!currentTestId || actionLoading === 'simulate'} className="btn-outline">
                            Simulate Data
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Header Actions (kept for other actions) */}
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