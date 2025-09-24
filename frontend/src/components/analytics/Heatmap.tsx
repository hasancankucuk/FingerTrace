import { getSessionHeatMap } from "@/services/tracey";
import { useEffect, useState, useRef } from "react"

export const HeatMap = () => {
    const [data, setData] = useState<{ heatmap: string } | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const heatmapData = await getSessionHeatMap();
            setData(heatmapData);
        };
        fetchData();
    }, []);

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