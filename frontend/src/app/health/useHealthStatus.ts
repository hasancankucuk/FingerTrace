import { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '@/services/health';
import type { HealthResponse } from '@/models/HealthResponse';
import type { HealthError } from './types';

interface UseHealthStatusReturn {
  health: HealthResponse | null;
  loading: boolean;
  error: HealthError | null;
  refreshHealth: () => Promise<void>;
}

export const useHealthStatus = (): UseHealthStatusReturn => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HealthError | null>(null);

  const refreshHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await checkHealth();
      setHealth(response);
    } catch (e: any) {
      const healthError: HealthError = {
        message: e.message || 'Failed to fetch health status',
        statusCode: e.response?.status,
        response: e.response
      };
      
      setError(healthError);
      
      // If 503 with health data, still show it
      if (e.response?.status === 503 && e.response?.data) {
        setHealth(e.response.data);
      } else {
        setHealth(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  return { health, loading, error, refreshHealth };
};