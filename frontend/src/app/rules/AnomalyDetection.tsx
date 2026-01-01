import { RuleBuilder } from "@/components/rules/RuleBuilder";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type AnomalyDetectionProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
    anomalyRules?: RuleCondition[] | undefined;
    riskLevel?: RiskLevel;
};

export const AnomalyDetection = ({ onConfigChange, anomalyRules, riskLevel }: AnomalyDetectionProps) => {
    const { t } = useTranslation();

    const ANOMALY_FIELDS = useMemo(() => [
        { id: "color_depth", label: t("fields.color_depth") },
        { id: "platform", label: t("fields.platform") },
        { id: "bar_visibility", label: t("fields.bar_visibility") },
        { id: "color_gamut", label: t("fields.color_gamut") },
        { id: "browser_feature_support", label: t("fields.browser_support") },
        { id: "time_zone", label: t("fields.time_zone") },
    ], [t]);

    const defaultCondition: RuleCondition = {
        id: "", // Will be generated
        logic: "AND",
        field: "platform",
        operator: "eq",
        value: ""
    };

    return (
        <RuleBuilder
            icon={ShieldAlert}
            title={t("rules.anomaly_detection")}
            description={t("rules.anomaly_detection_system_desc", { count: ANOMALY_FIELDS.length })}
            fields={ANOMALY_FIELDS}
            defaultCondition={defaultCondition}
            addButtonText={t("rules.add_condition")}
            initialRules={anomalyRules}
            initialRiskLevel={riskLevel}
            onConfigChange={onConfigChange}
        />
    );
};