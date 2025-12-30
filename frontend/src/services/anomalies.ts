import type { AnomalyRules } from "@/models/AnomalyRules";
import { RiskLevel, type RuleCondition } from "@/models/RiskLevelModel";
import { getToken } from "./auth";
import { httpRequest } from "./http";

const API_BASE_URL = import.meta.env.VITE_APP_URL;

interface RateLimitingAlert {
  id: string;
  type: string;
  target_identifier: string;
  fingerprint?: string;
  count: number;
  created_at: string;
  severity: string;
}

interface FastTravelAlert {
  fingerprint: string;
  from: string;
  to: string;
  distance_km: number;
  estimated_speed_kmh: number;
  time_diff_hours: number;
  severity: string;
}

interface SaveRulesRequest {
  type: string;
  conditions: RuleCondition[];
  risk_level: RiskLevel;
  workspace_id: string;
}

export const getRateLimiting = async (): Promise<RateLimitingAlert[]> => {
  const token = getToken();
  return httpRequest<RateLimitingAlert[]>(`${API_BASE_URL}/get-rate-limiting`, {
    method: "GET",
    token,
  });
};

export const getFastTravel = async (workspaceId?: string): Promise<FastTravelAlert[]> => {
  const token = getToken();
  const url = workspaceId
    ? `${API_BASE_URL}/get-fast-travel?workspace_id=${workspaceId}`
    : `${API_BASE_URL}/get-fast-travel`;

  return httpRequest<FastTravelAlert[]>(url, {
    method: "GET",
    token,
  });
};

export const saveRules = async (payload: SaveRulesRequest[]): Promise<{ status: string; message: string }> => {
  const token = getToken();
  return httpRequest<{ status: string; message: string }>(`${API_BASE_URL}/save-rules`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
};

export const getAnomalyRules = async (workspaceId?: string): Promise<AnomalyRules[]> => {
  const token = getToken();
  const url = `${API_BASE_URL}/get-anomaly-rules?workspace_id=${workspaceId}`
  return httpRequest<AnomalyRules[]>(url, {
    method: "GET",
    token,
  });
}