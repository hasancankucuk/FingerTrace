import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useUserQuery } from "@/queries/userQueries";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


export const Plans = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: userData } = useUserQuery();

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

    const visiblePlans = plans.filter(plan => plan.id !== "free");

    return (
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
                                    disabled={userData?.subscription_status === 'active' && isPro}
                                >
                                    {isPro && (userData?.subscription_status === 'trialing' || userData?.subscription_status === 'cancelled' || userData?.subscription_status === 'active')
                                        ? (userData?.subscription_status === 'active' ? t("common.current_plan", { defaultValue: "Current Plan" }) : t(`${plan.key}.cta_upgrade`))
                                        : t(`${plan.key}.cta`)}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}

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
    )
}