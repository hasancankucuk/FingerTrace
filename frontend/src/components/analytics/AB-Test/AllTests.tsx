import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CheckCircle, Pause, Play, Trash2, Users } from "lucide-react"

interface Test {
    id: string;
    test_name: string;
    status: "active" | "paused" | "completed" | string;
    created_at: string;
    sample_size: number;

}

interface AllTestsProps {
    allTests: {
        tests: Test[];
    };
    currentTestId?: string;
    setCurrentTestId: (id: string) => void;
    handleTestStatusUpdate: (id: string, status: "active" | "paused" | "completed") => void;
    handleDeleteTest: (id: string) => void;
    actionLoading: string | null;
}

export const AllTests = ({
    allTests,
    handleTestStatusUpdate,
    actionLoading,
    setCurrentTestId,
    currentTestId,
    handleDeleteTest
}: AllTestsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    All A/B Tests
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Manage and monitor all your A/B tests
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {allTests.tests.map((test: any) => (
                        <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${test.status === 'active' ? 'bg-green-500' :
                                    test.status === 'completed' ? 'bg-blue-500' :
                                        test.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                                    }`}></div>
                                <div>
                                    <div className="font-medium">{test.test_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        ID: {test.id} • Created: {new Date(test.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                    <Users className="h-3 w-3 mr-1" />
                                    {test.sample_size} samples
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={
                                    test.status === 'active' ? 'default' :
                                        test.status === 'completed' ? 'secondary' :
                                            'outline'
                                }>
                                    {test.status}
                                </Badge>
                                <div className="flex gap-1">
                                    {test.status === 'active' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleTestStatusUpdate(test.id, 'paused')}
                                            disabled={actionLoading === 'status-paused'}
                                        >
                                            <Pause className="h-3 w-3" />
                                        </Button>
                                    )}
                                    {test.status === 'paused' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleTestStatusUpdate(test.id, 'active')}
                                            disabled={actionLoading === 'status-active'}
                                        >
                                            <Play className="h-3 w-3" />
                                        </Button>
                                    )}
                                    {test.status !== 'completed' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleTestStatusUpdate(test.id, 'completed')}
                                            disabled={actionLoading === 'status-completed'}
                                        >
                                            <CheckCircle className="h-3 w-3" />
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setCurrentTestId(test.id)}
                                        className={currentTestId === test.id ? 'bg-blue-100' : ''}
                                    >
                                        Select
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteTest(test.id)}
                                        disabled={actionLoading === 'delete'}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}