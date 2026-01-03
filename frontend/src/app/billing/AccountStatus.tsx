import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { usageQuery } from "@/queries/analysisQueries";
import { useUserQuery } from "@/queries/userQueries";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";


export const AccountStatus = () => {
    const { t } = useTranslation();
    const { data: userData } = useUserQuery();
    const { data: analysisData, isLoading, error: usageError } = usageQuery();

    if (isLoading) return <div>Loading...</div>
    if (usageError) return toast.error(t("common.usage.error", { defaultValue: "Error" }))


    return (
        <Card className={`shadow-none border-border/50 ${analysisData?.status === 'cancelled' ? 'border-destructive/30 bg-destructive/5' : ''}`}>
            <CardHeader className="py-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShieldAlert className={`h-4 w-4 ${analysisData?.status === 'cancelled' ? 'text-destructive' : 'text-primary'}`} />
                    {t("common.usage.account_status", { defaultValue: "Status" })}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between text-sm py-1">
                    <span className="text-muted-foreground">Current Plan</span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                        {analysisData?.status === 'trialing' ? "Free Trial" : analysisData?.status?.toUpperCase()}
                    </Badge>
                </div>
                {analysisData?.status === 'trialing' && (
                    <div className="flex items-center justify-between text-sm py-1">
                        <span className="text-muted-foreground">{t("common.usage.trial_remaining", { defaultValue: "Trial" })}</span>
                        <span className="font-semibold text-primary">{analysisData?.trial_left} days</span>
                    </div>
                )}
                <div className="flex items-center justify-between text-sm py-1">
                    <span className="text-muted-foreground">{t("common.usage.monthly_quota", { defaultValue: "Limit" })}</span>
                    <span className="font-semibold">1,000 Events</span>
                </div>
                {userData?.subscription_status === 'cancelled' && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                        <p className="text-[10px] text-destructive font-medium leading-tight">
                            Trial ended. Restore access by upgrading to a Pro plan.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}