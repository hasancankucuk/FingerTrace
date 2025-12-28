export const RiskLevel = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export interface RuleCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logic: string;
}

export const OPERATORS = [
  { id: "eq", label: "==" },
  { id: "neq", label: "!=" },
  { id: "lt", label: "<" },
  { id: "gt", label: ">" },
  { id: "contains", label: "Contains" },
];

export const LOGIC_OPERATORS = ["IF", "AND", "OR", "IF NOT"];

export const initialConditions: RuleCondition[] = [
  { id: "1", logic: "IF", field: "color_depth", operator: "lt", value: "24" },
];