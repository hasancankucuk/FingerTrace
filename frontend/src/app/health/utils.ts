import type { HealthStatus, ComponentCheck } from './types';

export const getStatusColor = (status: HealthStatus): string => {
  const colors = {
    healthy: 'text-green-600',
    degraded: 'text-yellow-600',
    unhealthy: 'text-red-600'
  } as const;
  
  return colors[status] || colors.unhealthy;
};

export const getStatusMessage = (status: HealthStatus): string => {
  const messages = {
    healthy: 'All systems operational',
    degraded: 'Some issues detected',
    unhealthy: 'System experiencing problems'
  } as const;
  
  return messages[status] || messages.unhealthy;
};

export const parseComponentChecks = (checks: Record<string, string>): ComponentCheck[] => {
  return Object.entries(checks).map(([key, value]) => ({
    key,
    value,
    status: getComponentStatus(value)
  }));
};

const getComponentStatus = (value: string): ComponentCheck['status'] => {
  const lowerValue = value.toLowerCase();
  if (lowerValue.startsWith('ok')) return 'ok';
  if (lowerValue.startsWith('error')) return 'error';
  return 'warning';
};

export const getFailedComponents = (checks: ComponentCheck[]): ComponentCheck[] => {
  return checks.filter(check => check.status === 'error');
};