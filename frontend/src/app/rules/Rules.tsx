import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/hooks/useWorkspace";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { useAnomalyRulesQuery } from "@/queries/anomalyQueries";
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
    const { workspace } = useWorkspace();

    const [anomalyDetectionConfig, setAnomalyDetectionConfig] = useState<RuleConfig | null>(null);
    const [rateLimitingConfig, setRateLimitingConfig] = useState<RuleConfig | null>(null);
    const [fastTravelConfig, setFastTravelConfig] = useState<RuleConfig | null>(null);
    const [vpnProxyConfig, setVpnProxyConfig] = useState<RuleConfig | null>(null);

    const {
        data: anomalyRules,
        error: anomalyErrors,
        isLoading: anomalyLoading,
    } = useAnomalyRulesQuery(String(workspace?.id || ""));

    console.log(anomalyRules)

    if (anomalyLoading) {
        return <Loader2 className="animate-spin" />;
    }

    if (anomalyErrors) {
        toast.error(t("rules.error") || "Failed to load anomaly rules.");
        return;
    }

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = [
                {
                    type: 'anomaly_detection',
                    conditions: anomalyDetectionConfig?.conditions || [],
                    risk_level: anomalyDetectionConfig?.riskLevel || RiskLevel.NONE,
                    workspace_id: String(workspace?.id || ""),
                },
                {
                    type: 'rate_limiting',
                    conditions: rateLimitingConfig?.conditions || [],
                    risk_level: rateLimitingConfig?.riskLevel || RiskLevel.NONE,
                    workspace_id: String(workspace?.id || ""),
                },
                {
                    type: 'fast_travel',
                    conditions: fastTravelConfig?.conditions || [],
                    risk_level: fastTravelConfig?.riskLevel || RiskLevel.NONE,
                    workspace_id: String(workspace?.id || ""),
                },
                {
                    type: 'vpn_proxy',
                    conditions: vpnProxyConfig?.conditions || [],
                    risk_level: vpnProxyConfig?.riskLevel || RiskLevel.NONE,
                    workspace_id: String(workspace?.id || ""),
                }
            ];

            await saveRules(payload);

            toast.success(t("rules.save_success") || "All rules published successfully!");
        } catch (error) {
            toast.error(t("rules.save_error") || "Failed to save rules.");
            console.error("Save all rules error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const getRuleConditions = (type: string) => {
        return anomalyRules?.find((r) => r.type === type)?.conditions || [];
    };

    const getRuleRiskLevel = (type: string) => {
        return anomalyRules?.find((r) => r.type === type)?.risk_level || RiskLevel.NONE;
    };

    return (
        <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-destructive">
            <div className="p-6 space-y-8">
                <AnomalyDetection
                    onConfigChange={setAnomalyDetectionConfig}
                    anomalyRules={getRuleConditions("anomaly_detection")}
                    riskLevel={getRuleRiskLevel("anomaly_detection")}
                />
                <Separator className="h-px bg-border" />

                <RateLimiting
                    onConfigChange={setRateLimitingConfig}
                    rateLimitingRules={getRuleConditions("rate_limiting")}
                    riskLevel={getRuleRiskLevel("rate_limiting")}
                />
                <Separator className="h-px bg-border" />

                <FastTravel
                    onConfigChange={setFastTravelConfig}
                    fastTravelRules={getRuleConditions("fast_travel")}
                    riskLevel={getRuleRiskLevel("fast_travel")}
                />
                <Separator className="h-px bg-border" />

                <VPNProxy
                    onConfigChange={setVpnProxyConfig}
                    vpnProxyRules={getRuleConditions("vpn_proxy")}
                    riskLevel={getRuleRiskLevel("vpn_proxy")}
                />
            </div>

            <CardFooter className="border-t p-6 bg-muted/20">
                <Button
                    className="w-full shadow-md font-bold uppercase tracking-wide"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t("rules.save_all")}
                </Button>
            </CardFooter>
        </Card>
    );
};