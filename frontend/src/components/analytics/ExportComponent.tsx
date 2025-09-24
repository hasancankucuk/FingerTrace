import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { exportAnalyticsData } from "@/services/tracey";

interface ExportData {
    data: any[];
    total_records: number;
    export_timestamp: string;
}

export const ExportComponent = () => {
    const [exportData, setExportData] = useState<ExportData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await exportAnalyticsData();
            setExportData(response);

            const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Export Analytics Data</h2>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Data Export
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Export all analytics data for further analysis. The data includes session information, 
                            user interactions, and performance metrics.
                        </p>
                        
                        <Button 
                            onClick={handleExport} 
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            {loading ? 'Exporting...' : 'Export Data'}
                        </Button>
                        
                        {exportData && (
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <div className="text-sm">
                                    <div className="font-medium">Export Summary:</div>
                                    <div>Total Records: {exportData.total_records}</div>
                                    <div>Export Time: {new Date(exportData.export_timestamp).toLocaleString()}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};