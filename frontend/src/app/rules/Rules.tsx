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
import { VPNProxy } from "./VpnProxy";

type RuleConfig = {
    riskLevel: RiskLevel;
    conditions: RuleCondition[];
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
            const payload = [
                {
                    type: 'anomaly_detection',
                    conditions: anomalyDetectionConfig?.conditions || [],
                    risk_level: anomalyDetectionConfig?.riskLevel || RiskLevel.LOW,
                },
                {
                    type: 'rate_limiting',
                    conditions: rateLimitingConfig?.conditions || [],
                    risk_level: rateLimitingConfig?.riskLevel || RiskLevel.LOW,
                },
                {
                    type: 'fast_travel',
                    conditions: fastTravelConfig?.conditions || [],
                    risk_level: fastTravelConfig?.riskLevel || RiskLevel.LOW,
                },
                {
                    type: 'vpn_proxy',
                    conditions: vpnProxyConfig?.conditions || [],
                    risk_level: vpnProxyConfig?.riskLevel || RiskLevel.LOW,
                }
            ];

            console.log("Saving rules:", payload);

            await saveRules(payload);

            toast.success(t("rules.save_success") || "All rules published successfully!");
        } catch (error) {
            toast.error(t("rules.save_error") || "Failed to save rules.");
            console.error("Save all rules error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-destructive">
            <div className="p-6 space-y-8">
                <AnomalyDetection onConfigChange={setAnomalyDetectionConfig} />
                <Separator className="h-px bg-border" />

                <RateLimiting onConfigChange={setRateLimitingConfig} />
                <Separator className="h-px bg-border" />

                <FastTravel onConfigChange={setFastTravelConfig} />
                <Separator className="h-px bg-border" />

                <VPNProxy onConfigChange={setVpnProxyConfig} />
            </div>

            <CardFooter className="border-t p-6 bg-muted/20">
                <Button
                    className="w-full shadow-md font-bold uppercase tracking-wide"
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