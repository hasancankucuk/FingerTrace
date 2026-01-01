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
import { OPERATORS as GLOBAL_OPERATORS, LOGIC_OPERATORS, RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { ArrowRight, type LucideIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type RuleBuilderProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    fields: { id: string; label: string }[];
    operators?: { id: string; label: string }[];
    defaultCondition: RuleCondition;
    addButtonText: string;
    initialRules?: RuleCondition[];
    initialRiskLevel?: RiskLevel;
    onConfigChange?: (config: { riskLevel: RiskLevel; conditions: RuleCondition[] }) => void;
};

export const RuleBuilder = ({
    icon: Icon,
    title,
    description,
    fields,
    operators = GLOBAL_OPERATORS,
    defaultCondition,
    addButtonText,
    initialRules = [],
    initialRiskLevel = RiskLevel.NONE,
    onConfigChange,
}: RuleBuilderProps) => {
    const { t } = useTranslation();
    const [currentRiskLevel, setCurrentRiskLevel] = useState<RiskLevel>(initialRiskLevel);
    const [conditions, setConditions] = useState<RuleCondition[]>(
        initialRules.length > 0 ? initialRules : [defaultCondition]
    );

    useEffect(() => {
        onConfigChange?.({ riskLevel: currentRiskLevel, conditions });
    }, [currentRiskLevel, conditions, onConfigChange]);

    const addCondition = () => {
        setConditions([
            ...conditions,
            { ...defaultCondition, id: crypto.randomUUID() },
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


    if (conditions.length === 0 && initialRules.length === 0) {
    }

    return (
        <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-destructive/10 p-2 rounded-full">
                        <Icon className="text-destructive h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">{title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            {description}
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
                                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fields.map(f => (
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
                                    {operators.map(op => (
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
                    {addButtonText}
                </Button>
            </CardContent>
        </>
    );
};
