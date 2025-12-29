import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { saveRules } from "@/services/anomalies";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AnomalyDetection } from "./AnomalyDetection";
import { FastTravel } from "./FastTravel";
import { RateLimiting } from "./RateLimiting";
import { VPNProxy } from "./VPNProxy";

type RuleConfig = {
    riskLevel: RiskLevel;
    conditions: RuleCondition[];
};

type AllRulesConfig = {
    anomalyDetection: RuleConfig;
    rateLimiting: RuleConfig;
    fastTravel: RuleConfig;
    vpnProxy: RuleConfig;
};

export const Rules = () => {
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);

    const [anomalyDetectionConfig, setAnomalyDetectionConfig] = useState<RuleConfig | null>(null);
    const [rateLimitingConfig, setRateLimitingConfig] = useState<RuleConfig | null>(null);
    const [fastTravelConfig, setFastTravelConfig] = useState<RuleConfig | null>(null);
    const [vpnProxyConfig, setVpnProxyConfig] = useState<RuleConfig | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const rulesConfig: AllRulesConfig = {
                anomalyDetection: anomalyDetectionConfig || { riskLevel: RiskLevel.LOW, conditions: [] },
                rateLimiting: rateLimitingConfig || { riskLevel: RiskLevel.LOW, conditions: [] },
                fastTravel: fastTravelConfig || { riskLevel: RiskLevel.LOW, conditions: [] },
                vpnProxy: vpnProxyConfig || { riskLevel: RiskLevel.LOW, conditions: [] },
            };

            const ruleTypes: Array<{ key: keyof AllRulesConfig; type: string }> = [
                { key: 'anomalyDetection', type: 'anomaly_detection' },
                { key: 'rateLimiting', type: 'rate_limiting' },
                { key: 'fastTravel', type: 'fast_travel' },
                { key: 'vpnProxy', type: 'vpn_proxy' },
            ];

            await Promise.all(
                ruleTypes.map(({ key, type }) =>
                    saveRules({
                        type,
                        conditions: rulesConfig[key].conditions,
                        risk_level: rulesConfig[key].riskLevel,
                    })
                )
            );

            console.log("Saving rules:", rulesConfig);

            toast.success(t("rules.save_success") || "Rules published successfully!");
        } catch (error) {
            toast.error(t("rules.save_error") || "Failed to save rules.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-destructive">
            <div className="p-6 space-y-8">
                <AnomalyDetection
                    onConfigChange={setAnomalyDetectionConfig}
                />
                <Separator className="h-px bg-border" />

                <RateLimiting
                    onConfigChange={setRateLimitingConfig}
                />
                <Separator className="h-px bg-border" />

                <FastTravel
                    onConfigChange={setFastTravelConfig}
                />
                <Separator className="h-px bg-border" />

                <VPNProxy
                    onConfigChange={setVpnProxyConfig}
                />
            </div>

            <CardFooter className="border-t p-6 bg-muted/20">
                <Button
                    className="w-full shadow-md"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t("rules.save_all") || "Publish All Rules"}
                </Button>
            </CardFooter>
        </Card>
    );
};