import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAnalysisQuery } from "@/queries/analysisQueries";
import { useUserQuery } from "@/queries/userQueries";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Clock, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const UsageSidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { workspace } = useWorkspaceStore();

    // Calculate days since start of month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysSinceStart = Math.ceil((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    const { data: analysisData } = useAnalysisQuery(workspace?.id || "", daysSinceStart);

    const usage = analysisData?.usage || 0;
    const limit = 1000; // Hardcoded for free plan for now
    const percentage = Math.min(Math.round((usage / limit) * 100), 100);

    const { data: userData } = useUserQuery();
    const subscriptionStatus = userData?.subscription_status || "trialing";
    const trialStartDate = userData?.trial_start_date ? new Date(userData.trial_start_date) : null;
    const trialDaysLeft = trialStartDate
        ? Math.max(0, 7 - Math.floor((new Date().getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24)))
        : 7;
    const isRestricted = subscriptionStatus === 'cancelled';

    return (
        <div className="px-4 py-4 space-y-4 border-t border-border/40">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {t("common.usage.title")}
                </span>
                <span className={usage > limit * 0.9 ? "text-destructive font-bold" : ""}>
                    {usage.toLocaleString()} / {limit.toLocaleString()}
                </span>
            </div>

            <div className="space-y-2">
                <Progress
                    value={percentage}
                    className={`h-1.5 ${isRestricted ? 'bg-destructive/20' : ''}`}
                    indicatorClassName={isRestricted ? 'bg-destructive' : percentage > 90 ? "bg-destructive" : ""}
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isRestricted ? 'Restricted' : `${trialDaysLeft} ${t("common.usage.days_remaining")}`}
                    </span>
                    <span className={isRestricted ? 'text-destructive' : ''}>{percentage}%</span>
                </div>
            </div>

            <Button
                variant={isRestricted ? "destructive" : "outline"}
                size="sm"
                className={`w-full text-[11px] h-8 ${isRestricted ? '' : 'bg-primary/5 border-primary/20 hover:border-primary/50 hover:bg-primary/10'} transition-all font-medium`}
                onClick={() => navigate('/billing')}
            >
                {isRestricted ? "Restore Access" : t("common.usage.upgrade")}
            </Button>
        </div>
    );
};
