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
import { ArrowRight, Plus, Trash2, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type RateLimitingProps = {
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
    rateLimitingRules?: RuleCondition[];
    riskLevel?: RiskLevel;
};

export const RateLimiting = ({ onConfigChange, rateLimitingRules, riskLevel }: RateLimitingProps) => {
    const { t } = useTranslation();
    const [currentRiskLevel, setCurrentRiskLevel] = useState<RiskLevel>(riskLevel || RiskLevel.NONE);

    const [conditions, setConditions] = useState<RuleCondition[]>(rateLimitingRules || []);
    const RATE_LIMIT_FIELDS = useMemo(() => [
        { id: "request_count", label: t("fields.request_count") },
        { id: "window_seconds", label: t("fields.window") },
        { id: "retry_after", label: t("fields.retry_after") },
    ], [t]);

    useEffect(() => {
        onConfigChange?.({ riskLevel: currentRiskLevel, conditions });
    }, [currentRiskLevel, conditions, onConfigChange]);

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
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="space-y-3">
                    {conditions.map((condition, index) => (
                        <div key={condition.id} className="group relative flex flex-wrap items-center gap-3 p-4 bg-muted/30 border rounded-xl transition-all hover:border-primary/50">

                            <DropdownHelper
                                dropdownItems={LOGIC_OPERATORS}
                                onSelect={(v) => updateCondition(condition.id, { logic: v })}
                            >
                                <Badge
                                    variant={condition.logic === "IF NOT" ? "destructive" : "outline"}
                                    className="min-w-[65px] justify-center cursor-pointer shadow-sm h-9"
                                >
                                    {condition.logic}
                                </Badge>
                            </DropdownHelper>

                            <Select
                                value={condition.field}
                                onValueChange={(v) => updateCondition(condition.id, { field: v })}
                            >
                                <SelectTrigger className="w-full sm:w-[220px] bg-background">
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
                                <SelectTrigger className="w-full sm:w-[100px] bg-background">
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
                                className="w-full sm:w-[150px] bg-background"
                                placeholder={t("common.value") || "Value..."}
                            />

                            <div className="flex-1" />

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCondition(condition.id)}
                                disabled={conditions.length === 1}
                                className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 -ml-2 sm:ml-0"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            {/* Show Risk Outcome only on the last condition */}
                            {index === conditions.length - 1 && currentRiskLevel && (
                                <div className="hidden sm:flex items-center gap-2 ml-auto pl-4 border-l animate-in fade-in slide-in-from-left-4">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Then</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <DropdownHelper
                                        dropdownItems={Object.values(RiskLevel)}
                                        onSelect={(value) => setCurrentRiskLevel(value as RiskLevel)}
                                    >
                                        <Badge
                                            variant={currentRiskLevel === RiskLevel.HIGH ? "destructive" : currentRiskLevel === RiskLevel.MEDIUM ? "secondary" : "outline"}
                                            className="cursor-pointer capitalize px-3 py-1 shadow-sm text-sm"
                                        >
                                            {t(`rules.risk_level.${currentRiskLevel}`)}
                                        </Badge>
                                    </DropdownHelper>
                                </div>
                            )}

                            {/* Mobile Risk Outcome */}
                            {index === conditions.length - 1 && currentRiskLevel && (
                                <div className="flex sm:hidden w-full items-center justify-between mt-2 pt-2 border-t">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</span>
                                    <DropdownHelper
                                        dropdownItems={Object.values(RiskLevel)}
                                        onSelect={(value) => setCurrentRiskLevel(value as RiskLevel)}
                                    >
                                        <Badge
                                            variant={currentRiskLevel === RiskLevel.HIGH ? "destructive" : currentRiskLevel === RiskLevel.MEDIUM ? "secondary" : "outline"}
                                            className="cursor-pointer capitalize px-3 py-1 shadow-sm text-sm"
                                        >
                                            {t(`rules.risk_level.${currentRiskLevel}`)}
                                        </Badge>
                                    </DropdownHelper>
                                </div>
                            )}
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