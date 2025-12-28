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
}

export const getRateLimiting = async (): Promise<RateLimitingAlert[]> => {
  const token = getToken();
  return httpRequest<RateLimitingAlert[]>(`${API_BASE_URL}/api/get-rate-limiting`, {
    method: "GET",
    token,
  });
};

export const getFastTravel = async (): Promise<FastTravelAlert[]> => {
  const token = getToken();
  return httpRequest<FastTravelAlert[]>(`${API_BASE_URL}/api/get-fast-travel`, {
    method: "GET",
    token,
  });
};

export const saveRules = async (payload: SaveRulesRequest): Promise<{ status: string; message: string }> => {
  const token = getToken();
  return httpRequest<{ status: string; message: string }>(`${API_BASE_URL}/api/save-rules`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
};