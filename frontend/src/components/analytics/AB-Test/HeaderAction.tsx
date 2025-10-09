import { Button } from "@/components/ui/button";
import { Loader2, Play, TestTube } from "lucide-react";

export const HeaderAction = ({ createNewABTest, simulateTestData, currentTestId, actionLoading }: { createNewABTest: () => void; simulateTestData: () => void; currentTestId: string | undefined; actionLoading: string | null }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <h2 className="text-2xl font-bold">A/B Testing & Performance Analysis</h2>
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={createNewABTest}
                    variant="outline"
                    disabled={actionLoading === 'create'}
                >
                    {actionLoading === 'create' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                    )}
                    Create A/B Test
                </Button>
                <Button
                    onClick={simulateTestData}
                    variant="outline"
                    disabled={!currentTestId || actionLoading === 'simulate'}
                >
                    {actionLoading === 'simulate' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Play className="h-4 w-4 mr-2" />
                    )}
                    Simulate Data
                </Button>
            </div>
        </div>
    )
}