export const TestOverview = ({allTests, dialogueAnomalies}: {allTests: any, dialogueAnomalies: any}) => {
    return (

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{allTests.total_tests}</div>
                <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                <div className="text-2xl font-bold text-green-600">{allTests.active_tests}</div>
                <div className="text-sm text-muted-foreground">Active Tests</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{allTests.completed_tests}</div>
                <div className="text-sm text-muted-foreground">Completed Tests</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">
                    {dialogueAnomalies?.total_anomalies || 0}
                </div>
                <div className="text-sm text-muted-foreground">Anomalies Detected</div>
            </div>
        </div>
    )
}