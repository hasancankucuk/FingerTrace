import { usageQuery } from "@/queries/analysisQueries";
import { useUserQuery } from "@/queries/userQueries";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export const UsageSidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: usageData, isLoading, error: usageError } = usageQuery();
    const { data: userData } = useUserQuery();

    if (usageError) {
        toast.error(`Usage query error: ${usageError.message}`);
    }

    const usage = usageData?.usage || 0;
    const limit = usageData?.limit || 1000;
    const remaining = usageData?.remaining ?? 1000;
    const isTrial = usageData?.is_trial ?? true;

    const percentage = Math.min(Math.round((usage / limit) * 100), 100);

    const subscriptionStatus = userData?.subscription_status || "trialing";
    const isRestricted = subscriptionStatus === 'cancelled' || remaining <= 0;

    if (isLoading) return <div className="px-4 py-4 animate-pulse bg-muted/20 h-32 rounded-lg" />;

    return (
        <div className="px-4 py-4 space-y-4 border-t border-border/40">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {t("common.usage.title")}
                </span>
                <span className={percentage > 90 ? "text-destructive font-bold animate-pulse" : ""}>
                    {usage.toLocaleString()} / {limit.toLocaleString()}
                </span>
            </div>

            <div className="space-y-2">
                <Progress
                    value={percentage}
                    className="h-1.5"
                    indicatorClassName={percentage > 90 || remaining <= 0 ? "bg-destructive" : ""}
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                        {remaining <= 100 ? (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                        ) : (
                            <Clock className="h-3 w-3" />
                        )}
                        {remaining <= 0
                            ? t("common.usage.limit_reached")
                            : `${remaining.toLocaleString()} ${t("common.usage.remaining_requests")}`}
                    </span>
                    <span className={percentage > 90 ? 'text-destructive' : ''}>{percentage}%</span>
                </div>
            </div>

            <Button
                variant={isRestricted ? "destructive" : "outline"}
                size="sm"
                className={`w-full text-[11px] h-8 transition-all font-medium ${!isRestricted && 'bg-primary/5 border-primary/20 hover:border-primary/50 hover:bg-primary/10'
                    }`}
                onClick={() => navigate('/billing')}
            >
                {remaining <= 0 ? t("common.usage.increase_limit") : isRestricted ? "Restore Access" : t("common.usage.upgrade")}
            </Button>
        </div>
    );
};