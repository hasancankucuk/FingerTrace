import { RuleBuilder } from "@/components/rules/RuleBuilder";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { Globe } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type FastTravelProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
    fastTravelRules?: RuleCondition[];
    riskLevel?: RiskLevel;
};

export const FastTravel = ({ onConfigChange, fastTravelRules, riskLevel }: FastTravelProps) => {
    const { t } = useTranslation();

    const FAST_TRAVEL_FIELDS = useMemo(() => [
        { id: "estimated_speed", label: t("fields.estimated_speed") },
        { id: "distance_km", label: t("fields.distance") },
        { id: "time_diff", label: t("fields.time_diff") },
    ], [t]);

    const defaultCondition: RuleCondition = {
        id: "",
        logic: "AND",
        field: "estimated_speed",
        operator: "gt",
        value: ""
    };

    return (
        <RuleBuilder
            icon={Globe}
            title={t("rules.fast_travel")}
            description={t("rules.fast_travel_desc")}
            fields={FAST_TRAVEL_FIELDS}
            defaultCondition={defaultCondition}
            addButtonText={t("rules.add_travel_condition")}
            initialRules={fastTravelRules}
            initialRiskLevel={riskLevel}
            onConfigChange={onConfigChange}
        />
    );
};