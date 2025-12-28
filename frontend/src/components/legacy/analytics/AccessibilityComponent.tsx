import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAccessibilityMetrics } from "@/services/tracey";

interface AccessibilityMetrics {
    readability_score: number;
    contrast_ratio: number;
    keyboard_navigation: boolean;
    screen_reader_compatibility: boolean;
    suggestions: string[];
}

export const AccessibilityComponent = () => {
    const [metrics, setMetrics] = useState<AccessibilityMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await getAccessibilityMetrics();
                setMetrics(response);
            } catch (error) {
                console.error('Error fetching accessibility metrics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Accessibility Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Readability Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.readability_score || 0}/100</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Contrast Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.contrast_ratio?.toFixed(1) || 0}:1</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Keyboard Navigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={metrics?.keyboard_navigation ? "default" : "destructive"}>
                            {metrics?.keyboard_navigation ? "Enabled" : "Disabled"}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Screen Reader</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={metrics?.screen_reader_compatibility ? "default" : "destructive"}>
                            {metrics?.screen_reader_compatibility ? "Compatible" : "Not Compatible"}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Optimization Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {metrics?.suggestions?.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm">{suggestion}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};