import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "../ui/card";

interface HeatMapProps {
    data: { heatmap: string; } | null;
    loading: boolean
}

export const HeatMap = ({ data, loading }: HeatMapProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (data && iframeRef.current) {
            const iframe = iframeRef.current;
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    iframeDoc.open();
                    iframeDoc.write(data.heatmap);
                    iframeDoc.close();
                }
            } catch (error) {
                console.error('Error writing to iframe:', error);
            }
        }
    }, [data]);


    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="text-lg font-semibold mb-4">Session Heatmap</div>
            {data ? (
                <iframe
                    ref={iframeRef}
                    style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    title="Session Heatmap"
                    sandbox="allow-scripts allow-same-origin"
                />
            ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <div className="text-gray-500">Loading heatmap...</div>
                </div>
            )}
        </>
    )
}