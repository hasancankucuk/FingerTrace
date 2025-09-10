import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import type { HealthStatus } from './types';

interface StatusIconProps {
  status: HealthStatus;
  size?: number;
}

export const StatusIcon = ({ status, size = 32 }: StatusIconProps) => {
  const iconProps = { size };
  
  switch (status) {
    case 'healthy':
      return <IconCheck className="text-green-500" {...iconProps} />;
    case 'degraded':
      return <IconAlertTriangle className="text-yellow-500" {...iconProps} />;
    default:
      return <IconX className="text-red-500" {...iconProps} />;
  }
};