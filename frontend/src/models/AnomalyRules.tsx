import type { RiskLevel, RuleCondition } from "@/models/RiskLevelModel";

export interface AnomalyRules {
    conditions: RuleCondition[];
    risk_level: RiskLevel;
    type: string;
    updated_at: string;
    workspace_id: string;
}