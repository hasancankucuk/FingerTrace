export interface HealthError {
  message: string;
  statusCode?: number;
  response?: {
    status: number;
    data?: any;
  };
}

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ComponentCheck {
  key: string;
  value: string;
  status: 'ok' | 'error' | 'warning';
}