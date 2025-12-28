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
import { LOGIC_OPERATORS, OPERATORS, RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { Plus, Trash2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type RateLimitingProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
};

export const RateLimiting = ({ onConfigChange }: RateLimitingProps) => {
    const { t } = useTranslation();
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.LOW);

    const [conditions, setConditions] = useState<RuleCondition[]>([
        { id: "rl-1", logic: "IF", field: "request_count", operator: "gt", value: "100" }
    ]);
    const RATE_LIMIT_FIELDS = useMemo(() => [
        { id: "request_count", label: t("fields.request_count") },
        { id: "window_seconds", label: t("fields.window") },
        { id: "retry_after", label: t("fields.retry_after") },
    ], [t]);

    useEffect(() => {
        onConfigChange?.({ riskLevel, conditions });
    }, [riskLevel, conditions, onConfigChange]);

    const addCondition = () => {
        const newId = Math.random().toString(36).substring(2, 9);
        setConditions([
            ...conditions,
            { id: newId, logic: "AND", field: "request_count", operator: "gt", value: "" },
        ]);
    };

    const removeCondition = (id: string) => {
        if (conditions.length > 1) {
            setConditions(conditions.filter((c) => c.id !== id));
        }
    };

    const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
        setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    };

    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-destructive/10 p-2 rounded-full">
                        <Zap className="text-destructive h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">{t("rules.rate_limiting")}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            {t("rules.rate_limiting_desc")}
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
                                <SelectTrigger className="w-[220px] bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {RATE_LIMIT_FIELDS.map(f => (
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
                    {t("rules.add_velocity_condition")}
                </Button>
            </CardContent>
        </>
    );
};