import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, Pause, TestTube } from "lucide-react";
interface CurrentTestsProps {
    currentTestId?: string;
    handleTestStatusUpdate: (id: string, status: "active" | "paused" | "completed") => void;
    actionLoading: string | null;
    assignVariant: (id: string, variant: "A" | "B") => void;
}


export const CurrentTests = ({
    currentTestId,
    handleTestStatusUpdate,
    actionLoading,
    assignVariant
}: CurrentTestsProps) => {
    return (
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
                            <div className="ml-auto flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleTestStatusUpdate(currentTestId, 'paused')}
                                    disabled={actionLoading?.includes('status')}
                                >
                                    <Pause className="h-3 w-3 mr-1" />
                                    Pause
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleTestStatusUpdate(currentTestId, 'completed')}
                                    disabled={actionLoading?.includes('status')}
                                >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Complete
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => assignVariant(currentTestId, "A")}
                                disabled={actionLoading === 'assign-A'}
                            >
                                {actionLoading === 'assign-A' ?
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                Test Variant A
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => assignVariant(currentTestId, "B")}
                                disabled={actionLoading === 'assign-B'}
                            >
                                {actionLoading === 'assign-B' ?
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                Test Variant B
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TestTube className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-600 mb-2">No Active A/B Test</h3>
                        <p className="text-sm">Create an A/B test to start testing different response variants and measuring performance.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}