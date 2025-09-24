import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserSegmentation } from "@/services/tracey";

interface UserSegmentation {
    segments: Record<string, number>;
    recommendations: Record<string, string>;
    visualization?: string;
}

export const UserSegmentationComponent = () => {
    const [segmentation, setSegmentation] = useState<UserSegmentation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSegmentation = async () => {
            try {
                const response = await getUserSegmentation()
                setSegmentation(response);
            } catch (error) {
                console.error('Error fetching user segmentation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSegmentation();
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
            <h2 className="text-2xl font-bold">User Segmentation</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Segments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {segmentation && segmentation?.segments && Object.entries(segmentation.segments).map(([segment, count]) => (
                                <div key={segment} className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{segment.replace('_', ' ').toUpperCase()}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-primary h-2 rounded-full" 
                                                style={{ width: `${(count / Math.max(...Object.values(segmentation.segments))) * 100}%` }}
                                            ></div>
                                        </div>
                                        <Badge variant="outline">{count}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {segmentation && segmentation.recommendations && Object.entries(segmentation.recommendations).map(([segment, rec]) => (
                                <div key={segment} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="text-sm">
                                        <span className="font-medium">{segment.replace('_', ' ').toUpperCase()}: </span>
                                        {rec}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {segmentation && segmentation?.visualization && (
                <Card>
                    <CardHeader>
                        <CardTitle>Visualization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: segmentation.visualization }} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};