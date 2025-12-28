import { DropdownHelper } from "@/components/helpers/DropdownHelper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LOGIC_OPERATORS, RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type VPNProxyProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
};

export const VPNProxy = ({ onConfigChange }: VPNProxyProps) => {
    const { t } = useTranslation();

    const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.LOW);
    const [conditions, setConditions] = useState<RuleCondition[]>([
        { id: "1", logic: "IF", field: "is_proxy", operator: "eq", value: "true" }
    ]);

    const VPN_FIELDS = useMemo(() => [
        { id: "is_proxy", label: t("fields.is_proxy") },
        { id: "is_hosting", label: t("fields.is_hosting") },
    ], [t]);

    const OPERATORS = useMemo(() => [
        { id: "eq", label: "==" },
        { id: "neq", label: "!=" },
    ], []);

    useEffect(() => {
        onConfigChange?.({ riskLevel, conditions });
    }, [riskLevel, conditions, onConfigChange]);

    const addCondition = () => {
        setConditions([...conditions, {
            id: crypto.randomUUID(),
            logic: "AND",
            field: "is_hosting",
            operator: "eq",
            value: "true"
        }]);
    };

    const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
        setConditions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const removeCondition = (id: string) => {
        if (conditions.length > 1) {
            setConditions(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-destructive/10 p-2 rounded-full">
                        <ShieldAlert className="text-destructive h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">{t("rules.vpn_proxy")}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            {t("rules.vpn_proxy_desc")}
                        </p>
                    </div>
                </div>

                <DropdownHelper
                    dropdownItems={Object.values(RiskLevel)}
                    onSelect={(value) => setRiskLevel(value as RiskLevel)}
                >
                    <Badge
                        variant={riskLevel === RiskLevel.HIGH ? "destructive" : riskLevel === RiskLevel.MEDIUM ? "secondary" : "outline"}
                        className="cursor-pointer capitalize px-4 py-1"
                    >
                        {t(`rules.risk_level.${riskLevel}`)}
                    </Badge>
                </DropdownHelper>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-3">
                    {conditions.map((condition, index) => (
                        <div key={condition.id} className="group relative flex items-center gap-3 p-4 bg-muted/30 border rounded-xl transition-all hover:border-primary/50">

                            <DropdownHelper
                                dropdownItems={LOGIC_OPERATORS}
                                onSelect={(v) => updateCondition(condition.id, { logic: v })}
                            >
                                <Badge
                                    variant={condition.logic === "IF NOT" ? "destructive" : "outline"}
                                    className="min-w-[65px] justify-center cursor-pointer shadow-sm"
                                >
                                    {condition.logic}
                                </Badge>
                            </DropdownHelper>

                            <Select
                                value={condition.field}
                                onValueChange={(v) => updateCondition(condition.id, { field: v })}
                            >
                                <SelectTrigger className="w-[190px] bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {VPN_FIELDS.map(f => (
                                        <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={condition.operator}
                                onValueChange={(v) => updateCondition(condition.id, { operator: v })}
                            >
                                <SelectTrigger className="w-[110px] bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {OPERATORS.map(op => (
                                        <SelectItem key={op.id} value={op.id}>{op.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                                className="w-[130px] bg-background"
                                placeholder={t("common.value") || "Value..."}
                            />

                            {index === conditions.length - 1 && (
                                <div className="flex-1 flex justify-end">
                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-3 py-1">
                                        {t("rules.then_flag")}
                                    </Badge>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCondition(condition.id)}
                                disabled={conditions.length === 1}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={addCondition}
                    className="w-full border-dashed py-8 hover:bg-primary/5 hover:border-primary transition-all text-muted-foreground"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("rules.add_condition")}
                </Button>
            </CardContent>
        </>
    );
}