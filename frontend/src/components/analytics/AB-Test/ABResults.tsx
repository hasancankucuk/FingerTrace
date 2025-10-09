import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ABTestResults = ({ abTestResults, recordTestResult, actionLoading }: { abTestResults: any, recordTestResult: any, actionLoading: any }) => {
    return (

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
                        <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                            <div className={`text-2xl font-bold ${abTestResults.statistical_significance ? 'text-green-600' : 'text-red-600'}`}>
                                {abTestResults.statistical_significance ? "YES" : "NO"}
                            </div>
                            <div className="text-sm text-muted-foreground">Statistical Significance</div>
                            <Badge
                                variant={abTestResults.statistical_significance ? "default" : "secondary"}
                                className="mt-2"
                            >
                                {abTestResults.statistical_significance ? "Significant" : "Not Significant"}
                            </Badge>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                            <div className="text-2xl font-bold text-green-600">
                                {(abTestResults.confidence_level * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Confidence Level</div>
                            <Badge
                                variant={abTestResults.confidence_level >= 0.95 ? "default" : "secondary"}
                                className="mt-2"
                            >
                                {abTestResults.confidence_level >= 0.95 ? "High Confidence" : "Medium Confidence"}
                            </Badge>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                            <div className="text-2xl font-bold text-purple-600">
                                {abTestResults.winner || "TBD"}
                            </div>
                            <div className="text-sm text-muted-foreground">Winner</div>
                            {abTestResults.winner && (
                                <Badge variant="default" className="mt-2">
                                    Variant {abTestResults.winner}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Statistical Significance Indicator */}
                    {abTestResults.statistical_significance && (
                        <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                            <h6 className="font-medium text-green-800 mb-1">Test Complete ✅</h6>
                            <p className="text-sm text-green-700">
                                Results are statistically significant with {(abTestResults.confidence_level * 100).toFixed(1)}% confidence.
                                Variant {abTestResults.winner} is the clear winner.
                            </p>
                        </div>
                    )}

                    {/* Variant Comparison */}
                    <div>
                        <h4 className="font-semibold mb-3">Variant Performance Comparison</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["A", "B"].map((variant) => {
                                const data = variant === "A"
                                    ? abTestResults.variant_a_performance
                                    : abTestResults.variant_b_performance;

                                const isWinner = abTestResults.winner === variant;

                                return (
                                    <div
                                        key={variant}
                                        className={`p-4 border rounded-lg ${isWinner ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                                    >
                                        <h5 className="font-medium mb-3 flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${variant === 'A' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                                            Variant {variant}: {variant === "A" ? "Standard Response" : "Enhanced Response"}
                                            {isWinner && <Badge variant="default">🏆 Winner</Badge>}
                                        </h5>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Sample Size:</span>
                                                <span className="font-bold">{data?.sample_size || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Avg Response Time:</span>
                                                <Badge
                                                    variant={data?.avg_response_time && data.avg_response_time <= 2 ? "default" : "secondary"}
                                                >
                                                    {data?.avg_response_time?.toFixed(2) || 0}s
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Avg Satisfaction:</span>
                                                <Badge
                                                    variant={data?.avg_satisfaction && data.avg_satisfaction >= 4 ? "default" : "secondary"}
                                                >
                                                    {data?.avg_satisfaction?.toFixed(2) || 0}/5
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Conversion Rate:</span>
                                                <Badge
                                                    variant={data?.conversion_rate && data.conversion_rate >= 0.7 ? "default" : "secondary"}
                                                >
                                                    {((data?.conversion_rate || 0) * 100).toFixed(1)}%
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Test Actions */}
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => recordTestResult("A", 2.5, 4.2)}
                            disabled={actionLoading === 'record-A'}
                        >
                            {actionLoading === 'record-A' ?
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Record A Result
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => recordTestResult("B", 2.1, 4.5)}
                            disabled={actionLoading === 'record-B'}
                        >
                            {actionLoading === 'record-B' ?
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Record B Result
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}