import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, TestTube } from "lucide-react";
import { assignTestVariant, getABTestResults, recordABTestResult, setupABTest } from "@/services/tracey";

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
    loading?: boolean;
    abTestResults?: ABTestResults;
    setAbTestResults: (results: ABTestResults) => void;
    fetchAllData: () => void;
};

export const TestingComponent = ({
    currentTestId,
    setCurrentTestId,
    loading,
    abTestResults,
    setAbTestResults,
    fetchAllData
}: TestingComponentProps) => {


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
            await recordABTestResult(resultData);
            console.log('Test result recorded:', resultData);

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

            await recordTestResult(variant, Math.random() * 3 + 1, Math.random() * 2 + 3);
        } catch (error) {
            console.error('Error assigning variant:', error);
        }
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

            if (result.test_id) {
                setCurrentTestId(result.test_id);
                const testResults = await getABTestResults(result.test_id);
                setAbTestResults(testResults);
            }

            fetchAllData();
        } catch (error) {
            console.error('Error creating A/B test:', error);
        }
    };


    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <h2 className="text-2xl font-bold">A/B Testing & Performance Analysis</h2>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={createNewABTest} variant="outline">
                        <TestTube className="h-4 w-4 mr-2" />
                        Create A/B Test
                    </Button>
                    <Button onClick={simulateTestData} variant="outline" disabled={!currentTestId}>
                        <Play className="h-4 w-4 mr-2" />
                        Simulate Data
                    </Button>
                    <Button onClick={fetchAllData} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh Data"}
                    </Button>
                </div>
            </div>

            {/* Current Test Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Current A/B Test Status</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Active test: {currentTestId ? `Test ID: ${currentTestId}` : "No active test"}
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
                                <Button variant="outline" onClick={() => assignVariant(currentTestId, "A")}>
                                    Test Variant A
                                </Button>
                                <Button variant="outline" onClick={() => assignVariant(currentTestId, "B")}>
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
                        <div className="space-y-4">
                            {/* Test Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {abTestResults.statistical_significance ? "YES" : "NO"}
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
                                        {abTestResults.winner || "TBD"}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Winner</div>
                                </div>
                            </div>

                            {/* Variant Comparison */}
                            <div>
                                <h4 className="font-semibold mb-3">Variant Performance Comparison</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {["A", "B"].map((variant) => {
                                        const data = variant === "A"
                                            ? abTestResults.variant_a_performance
                                            : abTestResults.variant_b_performance;

                                        return (
                                            <div key={variant} className="p-4 border rounded">
                                                <h5 className="font-medium mb-3 flex items-center gap-2">
                                                    Variant {variant}: {variant === "A" ? "Standard Response" : "Enhanced Response"}
                                                    {abTestResults.winner === variant && <Badge variant="default">Winner</Badge>}
                                                </h5>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Sample Size:</span>
                                                        <span className="font-bold">{data?.sample_size || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Response Time:</span>
                                                        <span className="font-bold">{data?.avg_response_time?.toFixed(2) || 0}s</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Avg Satisfaction:</span>
                                                        <span className="font-bold">{data?.avg_satisfaction?.toFixed(2) || 0}/5</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Conversion Rate:</span>
                                                        <span className="font-bold">{((data?.conversion_rate || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Test Actions */}
                            <div className="flex flex-wrap justify-end gap-2">
                                <Button variant="outline" onClick={() => recordTestResult("A", 2.5, 4.2)}>
                                    Record A Result
                                </Button>
                                <Button variant="outline" onClick={() => recordTestResult("B", 2.1, 4.5)}>
                                    Record B Result
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};