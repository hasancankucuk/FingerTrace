import { FooterSection } from '@/components/landing/FooterSection';
import { NavigationBar } from '@/components/landing/NavigationBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconRefresh, IconX } from '@tabler/icons-react';
import { useHealthStatus } from './useHealthStatus';
import { StatusIcon } from './StatusIcon';
import { ErrorAlert } from './ErrorAlert';
import { ComponentStatus } from './ComponentStatus';
import { getStatusColor, getStatusMessage, parseComponentChecks, getFailedComponents } from './utils';
import type { HealthStatus } from './types';

export const Health = () => {
  const { health, loading, error, refreshHealth } = useHealthStatus();

  const componentChecks = health ? parseComponentChecks(health.checks) : [];
  const failedComponents = getFailedComponents(componentChecks);

  const renderContent = () => {
    if (!health && !error) {
      return (
        <div className="flex flex-col items-center gap-3 text-red-500 py-8">
          <IconX size={48} />
          <div className="text-center">
            <div className="font-semibold">System Unavailable</div>
            <div className="text-sm text-muted-foreground">Unable to fetch health status</div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {error && (
          <ErrorAlert error={error} failedComponents={failedComponents} />
        )}

        {health && (
          <>
            {/* Overall Status */}
            <div className="flex flex-col items-center gap-3 pb-4 border-b">
              <StatusIcon status={health.status as HealthStatus} />
              <div className="text-center">
                <div className={`font-bold text-2xl ${getStatusColor(health.status as HealthStatus)}`}>
                  {health.status.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getStatusMessage(health.status as HealthStatus)}
                </div>
              </div>
            </div>

            {/* Component Checks */}
            <ComponentStatus checks={componentChecks} />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationBar />
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor system components status</CardDescription>
              </div>
              <Button onClick={refreshHealth} size="sm" disabled={loading}>
                <IconRefresh className={loading ? 'animate-spin' : ''} />
                {loading ? 'Checking...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
      <FooterSection />
    </div>
  );
};
