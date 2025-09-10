import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconAlertCircle, IconX } from '@tabler/icons-react';
import type { HealthError, ComponentCheck } from './types';

interface ErrorAlertProps {
  error: HealthError;
  failedComponents: ComponentCheck[];
}

export const ErrorAlert = ({ error, failedComponents }: ErrorAlertProps) => {
  const is503 = error.statusCode === 503;
  
  return (
    <Alert className={`mb-6 ${is503 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
      {is503 ? (
        <IconAlertCircle className="h-4 w-4 text-yellow-600" />
      ) : (
        <IconX className="h-4 w-4 text-red-600" />
      )}
      <AlertDescription className={is503 ? 'text-yellow-800' : 'text-red-800'}>
        <div className="font-semibold">
          {is503 ? 'Service Degraded' : 'System Error'} 
          {error.statusCode && ` (HTTP ${error.statusCode})`}
        </div>
        <div className="mt-1">
          {is503 && failedComponents.length > 0 ? (
            <>
              The following components are experiencing issues:
              <ul className="mt-2 ml-4 list-disc">
                {failedComponents.map(({ key, value }) => (
                  <li key={key}>
                    <span className="font-medium capitalize">{key}:</span> {value}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            error.message
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};