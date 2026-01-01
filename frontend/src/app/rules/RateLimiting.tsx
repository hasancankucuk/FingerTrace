import { RuleBuilder } from "@/components/rules/RuleBuilder";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { Zap } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type RateLimitingProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
    rateLimitingRules?: RuleCondition[];
    riskLevel?: RiskLevel;
};

export const RateLimiting = ({ onConfigChange, rateLimitingRules, riskLevel }: RateLimitingProps) => {
    const { t } = useTranslation();

    const RATE_LIMIT_FIELDS = useMemo(() => [
        { id: "request_count", label: t("fields.request_count") },
        { id: "window_seconds", label: t("fields.window") },
        { id: "retry_after", label: t("fields.retry_after") },
    ], [t]);

    const defaultCondition: RuleCondition = {
        id: "",
        logic: "AND",
        field: "request_count",
        operator: "gt",
        value: ""
    };

    return (
        <RuleBuilder
            icon={Zap}
            title={t("rules.rate_limiting")}
            description={t("rules.rate_limiting_desc")}
            fields={RATE_LIMIT_FIELDS}
            defaultCondition={defaultCondition}
            addButtonText={t("rules.add_velocity_condition")}
            initialRules={rateLimitingRules}
            initialRiskLevel={riskLevel}
            onConfigChange={onConfigChange}
        />
    );
};