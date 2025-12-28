import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const PerformanceComparision = (performanceComparison: any) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Comparison Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Statistical comparison between variants
                </p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                        <div className={`text-2xl font-bold ${performanceComparison.response_time_improvement > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {performanceComparison?.response_time_improvement > 0 ? '+' : ''}
                            {performanceComparison?.response_time_improvement?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Response Time Change</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                        <div className={`text-2xl font-bold ${performanceComparison.satisfaction_improvement > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {performanceComparison.satisfaction_improvement > 0 ? '+' : ''}
                            {performanceComparison.satisfaction_improvement?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Satisfaction Change</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded">
                        <div className={`text-2xl font-bold ${performanceComparison.conversion_improvement > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {performanceComparison.conversion_improvement > 0 ? '+' : ''}
                            {performanceComparison.conversion_improvement?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Conversion Change</div>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <h6 className="font-medium text-blue-800 mb-1">Recommendation</h6>
                    <p className="text-sm text-blue-700">{performanceComparison.recommendation}</p>
                </div>
            </CardContent>
        </Card>
    )
}