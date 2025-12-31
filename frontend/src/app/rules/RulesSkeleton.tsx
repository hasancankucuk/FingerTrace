import { Card, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@radix-ui/react-separator"

export const RulesSkeleton = () => {
    return (
        <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-destructive">
            <div className="p-6 space-y-8">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40" />
                <Separator className="h-px bg-border" />

                <Skeleton className="h-4 w-32" />

                <Separator className="h-px bg-border" />

                <Skeleton className="h-4 w-32" />

                <Separator className="h-px bg-border" />

                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>

            <CardFooter className="border-t p-6 bg-muted/20">

                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40" />
            </CardFooter>
        </Card>
    )
}