import { RuleBuilder } from "@/components/rules/RuleBuilder";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type VPNProxyProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
    vpnProxyRules?: RuleCondition[];
    riskLevel?: RiskLevel;
};

export const VPNProxy = ({ onConfigChange, vpnProxyRules, riskLevel }: VPNProxyProps) => {
    const { t } = useTranslation();

    const VPN_FIELDS = useMemo(() => [
        { id: "is_proxy", label: t("fields.is_proxy") },
        { id: "is_hosting", label: t("fields.is_hosting") },
    ], [t]);

    const OPERATORS = useMemo(() => [
        { id: "eq", label: "==" },
        { id: "neq", label: "!=" },
    ], []);

    const defaultCondition: RuleCondition = {
        id: "",
        logic: "AND",
        field: "is_hosting",
        operator: "eq",
        value: "true"
    };

    return (
        <RuleBuilder
            icon={ShieldAlert}
            title={t("rules.vpn_proxy")}
            description={t("rules.vpn_proxy_desc")}
            fields={VPN_FIELDS}
            operators={OPERATORS}
            defaultCondition={defaultCondition}
            addButtonText={t("rules.add_condition")}
            initialRules={vpnProxyRules}
            initialRiskLevel={riskLevel}
            onConfigChange={onConfigChange}
        />
    );
};