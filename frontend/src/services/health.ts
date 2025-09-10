import type { HealthResponse } from "@/models/HealthResponse";
import { httpRequest } from "./http";

const API_BASE_URL = import.meta.env.VITE_APP_URL;

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await httpRequest<HealthResponse>(`${API_BASE_URL}/health`, {
      method: "GET",
    });
    return response;
  } catch (error: any) {
    if (error.response?.status === 503 && error.response?.data) {
      const healthError = new Error(error.response.data.message || "Service degraded");
      (healthError as any).response = {
        status: 503,
        data: error.response.data
      };
      throw healthError;
    }
    
    if (error.response) {
      const httpError = new Error(
        error.response.data?.message || 
        error.message || 
        `HTTP ${error.response.status}: Health check failed`
      );
      (httpError as any).response = {
        status: error.response.status,
        data: error.response.data
      };
      throw httpError;
    }
    
    // For network/other errors
    const message = error instanceof Error ? error.message : "Health check failed";
    console.error("Health check error:", message);
    throw new Error(message);
  }
};