import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import type { ComponentCheck } from './types';

interface ComponentStatusProps {
  checks: ComponentCheck[];
}

export const ComponentStatus = ({ checks }: ComponentStatusProps) => {
  const getIcon = (status: ComponentCheck['status']) => {
    switch (status) {
      case 'ok':
        return <IconCheck className="text-green-500" size={20} />;
      case 'error':
        return <IconX className="text-red-500" size={20} />;
      default:
        return <IconAlertTriangle className="text-yellow-500" size={20} />;
    }
  };

  const getStyles = (status: ComponentCheck['status']) => {
    switch (status) {
      case 'ok':
        return {
          container: 'border-green-200 bg-green-50',
          text: 'text-green-700'
        };
      case 'error':
        return {
          container: 'border-red-200 bg-red-50',
          text: 'text-red-700'
        };
      default:
        return {
          container: 'border-yellow-200 bg-yellow-50',
          text: 'text-yellow-700'
        };
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Component Status</h3>
      <div className="grid gap-3">
        {checks.map(({ key, value, status }) => {
          const styles = getStyles(status);
          
          return (
            <div key={key} className={`flex items-center justify-between p-3 rounded-lg border ${styles.container}`}>
              <div className="flex items-center gap-3">
                {getIcon(status)}
                <span className="font-medium capitalize">{key}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${styles.text}`}>
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};