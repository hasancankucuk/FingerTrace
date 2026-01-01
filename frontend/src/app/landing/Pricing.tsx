import { FooterSection } from "@/components/landing/FooterSection";
import { NavigationBar } from "@/components/landing/NavigationBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Pricing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const plans = [
        {
            id: "free",
            key: "landing.pricing.free",
            href: "/signup",
            variant: "outline" as const,
        },
        {
            id: "pro",
            key: "landing.pricing.pro",
            href: "/signup",
            variant: "default" as const,
            popular: true,
        },
        {
            id: "enterprise",
            key: "landing.pricing.enterprise",
            href: "/contact",
            variant: "outline" as const,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <NavigationBar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
                    <Badge variant="outline" className="px-4 py-2">
                        {t("landing.pricing.title")}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {t("landing.pricing.title")}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {t("landing.pricing.subtitle")}
                    </p>
                </div>


                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col h-full border-2 transition-all hover:shadow-xl ${plan.popular
                                ? "border-primary shadow-lg scale-105 z-10"
                                : "hover:border-primary/20"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                        {t(`${plan.key}.popular`)}
                                    </Badge>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl">{t(`${plan.key}.name`)}</CardTitle>
                                <CardDescription>{t(`${plan.key}.description`)}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow space-y-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{t(`${plan.key}.price`)}</span>
                                    {t(`${plan.key}.period`) && (
                                        <span className="text-muted-foreground">{t(`${plan.key}.period`)}</span>
                                    )}
                                </div>

                                <ul className="space-y-3">
                                    {(Array.isArray(t(`${plan.key}.features`, { returnObjects: true }))
                                        ? (t(`${plan.key}.features`, { returnObjects: true }) as string[])
                                        : []
                                    ).map(
                                        (feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm">
                                                <div className="mt-1 bg-primary/10 rounded-full p-0.5">
                                                    <Check className="h-3.5 w-3.5 text-primary" />
                                                </div>
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full group"
                                    variant={plan.variant}
                                    size="lg"
                                    onClick={() => navigate(plan.href)}
                                >
                                    {t(`${plan.key}.cta`)}
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <section className="mt-28 text-center bg-muted/30 rounded-2xl py-12 px-6">
                    <h2 className="text-2xl font-bold mb-4">{t("landing.features.section_cta_title", { defaultValue: "Need more info?" })}</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {t("landing.features.section_cta_description", { defaultValue: "Our team is here to help you find the best solution for your security needs." })}
                    </p>
                    <Button variant="link" size="lg" onClick={() => navigate('/contact')}>
                        {t("landing.footer.links.about")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </section>
            </main>

            <FooterSection />
        </div>
    );
};