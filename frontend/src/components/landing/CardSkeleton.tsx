import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export const CardSkeleton = () => {
    return (
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-6 px-4 py-6">
              <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle><Skeleton className="h-4 w-24" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle><Skeleton className="h-4 w-48" /></CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[260px] w-full" />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle><Skeleton className="h-4 w-32" /></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
    )
}