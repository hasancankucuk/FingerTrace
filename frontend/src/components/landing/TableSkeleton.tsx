import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export const TableSkeleton = () => {
    return (

        <div className="max-w-7xl mx-auto space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-96 mt-2" /></CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-10 w-64" />
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <div className="h-12 border-b bg-muted/50 flex items-center px-4 space-x-4">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-[180px]" />
                        </div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 border-b last:border-0 flex items-center px-4 space-x-4">
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[120px]" />
                                <Skeleton className="h-4 w-[120px]" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 w-[180px]" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-48" />
                        <div className="flex space-x-2">
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-9" />
                            <Skeleton className="h-9 w-9" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}