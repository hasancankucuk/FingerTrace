import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DialogueTesting = ({ statisticalData }: any) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dialogue Performance Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Statistical analysis and performance trends
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Performance Stats */}
                    {statisticalData?.response_time_stats && (
                        <div>
                            <h5 className="font-medium mb-2">Response Time Statistics</h5>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                <div className="text-center p-2 bg-blue-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.mean.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Mean</div>
                                </div>
                                <div className="text-center p-2 bg-green-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.median.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Median</div>
                                </div>
                                <div className="text-center p-2 bg-yellow-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.std.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Std Dev</div>
                                </div>
                                <div className="text-center p-2 bg-purple-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.min.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Min</div>
                                </div>
                                <div className="text-center p-2 bg-red-50 rounded text-sm">
                                    <div className="font-bold">{statisticalData.response_time_stats.max.toFixed(2)}s</div>
                                    <div className="text-xs text-muted-foreground">Max</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}