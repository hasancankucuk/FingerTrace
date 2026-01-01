import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useAnalysisQuery } from "@/queries/analysisQueries";
import { useUserQuery } from "@/queries/userQueries";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Check, CreditCard, Monitor, ShieldAlert, Smartphone, SmartphoneNfc, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Billing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { workspace } = useWorkspaceStore();
    const { data: userData } = useUserQuery();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysSinceStart = Math.ceil((now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    const { data: analysisData } = useAnalysisQuery(workspace?.id || "", daysSinceStart);

    const subscriptionStatus = userData?.subscription_status || "trialing";
    const trialStartDate = userData?.trial_start_date ? new Date(userData.trial_start_date) : null;
    const trialDaysLeft = trialStartDate
        ? Math.max(0, 7 - Math.floor((now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24)))
        : 7;

    const platforms = [
        { name: "Web", count: analysisData?.platforms?.Web || 0, icon: Monitor, color: "bg-blue-500" },
        { name: "iOS", count: analysisData?.platforms?.iOS || 0, icon: Smartphone, color: "bg-gray-800" },
        { name: "Android", count: analysisData?.platforms?.Android || 0, icon: SmartphoneNfc, color: "bg-green-500" },
    ];

    const totalEvents = platforms.reduce((acc, p) => acc + p.count, 0);

    const plans = [
        {
            id: "free",
            key: "landing.pricing.free",
            href: "/account",
            variant: "outline" as const,
            icon: Zap,
        },
        {
            id: "pro",
            key: "landing.pricing.pro",
            href: "/checkout",
            variant: "default" as const,
            popular: true,
            icon: Sparkles,
        },
        {
            id: "enterprise",
            key: "landing.pricing.enterprise",
            href: "/checkout",
            variant: "outline" as const,
            icon: CreditCard,
        },
    ];

    // Filter out the Free plan if user is on Free (or any other current plan)
    // Actually, user said: "free hesap ise zaten onu göstermene de gerek yok"
    const visiblePlans = plans.filter(plan => plan.id !== "free");

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header - Dashboard Style */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    {t("nav.billing", { defaultValue: "Billing & Subscription" })}
                </h1>
                <p className="text-muted-foreground text-sm">
                    Manage your subscription, view usage stats and platform distribution.
                </p>
            </div>

            {/* Top Row: Usage & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Usage Stats Compact Card */}
                <Card className="lg:col-span-2 shadow-none border-border/50">
                    <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                {t("common.usage.usage_details", { defaultValue: "Usage Overview" })}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {t("analysis.last_30_days", { defaultValue: "Current Month" })}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {platforms.map((p) => (
                                <div key={p.name} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p.icon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs font-bold">{p.count}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{p.name}</p>
                                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${p.color} transition-all`}
                                                style={{ width: `${totalEvents > 0 ? (p.count / totalEvents) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Account Status Card */}
                <Card className={`shadow-none border-border/50 ${subscriptionStatus === 'cancelled' ? 'border-destructive/30 bg-destructive/5' : ''}`}>
                    <CardHeader className="py-4">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ShieldAlert className={`h-4 w-4 ${subscriptionStatus === 'cancelled' ? 'text-destructive' : 'text-primary'}`} />
                            {t("common.usage.account_status", { defaultValue: "Status" })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                        <div className="flex items-center justify-between text-sm py-1">
                            <span className="text-muted-foreground">Current Plan</span>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                                {subscriptionStatus === 'trialing' ? "Free Trial" : subscriptionStatus.toUpperCase()}
                            </Badge>
                        </div>
                        {subscriptionStatus === 'trialing' && (
                            <div className="flex items-center justify-between text-sm py-1">
                                <span className="text-muted-foreground">{t("common.usage.trial_remaining", { defaultValue: "Trial" })}</span>
                                <span className="font-semibold text-primary">{trialDaysLeft} days</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm py-1">
                            <span className="text-muted-foreground">{t("common.usage.monthly_quota", { defaultValue: "Limit" })}</span>
                            <span className="font-semibold">1,000 Events</span>
                        </div>
                        {subscriptionStatus === 'cancelled' && (
                            <div className="mt-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                                <p className="text-[10px] text-destructive font-medium leading-tight">
                                    Trial ended. Restore access by upgrading to a Pro plan.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Plans Section */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold tracking-tight px-1">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visiblePlans.map((plan) => {
                        const Icon = plan.icon;
                        const isPro = plan.id === 'pro';
                        return (
                            <Card
                                key={plan.id}
                                className={`flex flex-col shadow-none relative transition-all border-border/50 hover:border-primary/30 ${isPro ? "border-primary/50 ring-1 ring-primary/10" : ""}`}
                            >
                                {isPro && (
                                    <div className="absolute -top-2.5 right-4">
                                        <Badge className="bg-primary text-primary-foreground text-[9px] uppercase font-black px-2 py-0.5">
                                            {t("landing.pricing.pro.popular", { defaultValue: "POPULAR" })}
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-md ${isPro ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <CardTitle className="text-sm font-bold uppercase tracking-tight">{t(`${plan.key}.name`)}</CardTitle>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 py-2 flex-grow space-y-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black">{t(`${plan.key}.price`)}</span>
                                        <span className="text-muted-foreground text-[10px] font-medium">{t(`${plan.key}.period`)}</span>
                                    </div>

                                    <ul className="space-y-2">
                                        {(Array.isArray(t(`${plan.key}.features`, { returnObjects: true }))
                                            ? (t(`${plan.key}.features`, { returnObjects: true }) as string[])
                                            : []
                                        ).slice(0, 4).map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-[11px] leading-tight text-muted-foreground/80 font-medium">
                                                <Check className="h-3 w-3 text-primary shrink-0" />
                                                <span className="truncate">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="p-4 pt-2">
                                    <Button
                                        className="w-full text-xs font-bold"
                                        variant={isPro ? "default" : "outline"}
                                        onClick={() => navigate(plan.href)}
                                        disabled={subscriptionStatus === 'active' && isPro}
                                    >
                                        {isPro && (subscriptionStatus === 'trialing' || subscriptionStatus === 'cancelled' || subscriptionStatus === 'active')
                                            ? (subscriptionStatus === 'active' ? t("common.current_plan", { defaultValue: "Current Plan" }) : t(`${plan.key}.cta_upgrade`))
                                            : t(`${plan.key}.cta`)}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}

                    {/* Contact Support Card - Small */}
                    <Card className="flex flex-col shadow-none border-dashed border-border/80 bg-muted/10">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-tight">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 py-2 flex-grow">
                            <p className="text-[11px] text-muted-foreground/80 leading-snug">
                                Custom requirements or questions about our plans? Our team is ready to help.
                            </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-2">
                            <Button
                                className="w-full text-xs font-bold"
                                variant="outline"
                                onClick={() => navigate('/contact')}
                            >
                                Contact Sales
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};
