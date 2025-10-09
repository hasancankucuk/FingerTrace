import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Monitor, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PlatformMetrics = {
  sessions: number;
  avg_response_time: number;
  satisfaction: number;
  conversion_rate: number;
};

type CrossPlatformAnalysis = {
  web?: PlatformMetrics;
  mobile?: PlatformMetrics;
  api?: PlatformMetrics;
  [key: string]: PlatformMetrics | undefined;
};

type CrossPlatformDataType = {
  cross_platform_analysis: CrossPlatformAnalysis;
  best_performing_platform?: string;
  platform_recommendations?: { [key: string]: string };
};

export const CrossPlatformComponent = ({ crossPlatformData }: { crossPlatformData: CrossPlatformDataType }) => {
  const analysis = crossPlatformData?.cross_platform_analysis;

  const totalSessions = analysis
    ? Object.values(analysis).reduce((sum, platform) => sum + (platform?.sessions || 0), 0)
    : 0;

  const avgResponseTime = analysis
    ? (Object.values(analysis).reduce((sum, platform) => sum + (platform?.avg_response_time || 0), 0) /
      Object.values(analysis).length).toFixed(2)
    : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Platform Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Performance metrics across different platforms</p>
      </CardHeader>
      <CardContent>
        {analysis ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(analysis).length}</div>
                <div className="text-sm text-muted-foreground">Active Platforms</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{totalSessions}</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{avgResponseTime}s</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600 capitalize">{crossPlatformData.best_performing_platform || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Best Platform</div>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div>
              <h4 className="font-semibold mb-3">Platform Performance Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysis).map(([platformName, platform]) => (
                  <div key={platformName} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium capitalize flex items-center gap-2">
                        {platformName === 'web' && <Monitor className="h-4 w-4" />}
                        {platformName === 'mobile' && <Users className="h-4 w-4" />}
                        {platformName === 'api' && <Activity className="h-4 w-4" />}
                        {platformName}
                      </h5>
                      {crossPlatformData.best_performing_platform === platformName && (
                        <Badge variant="default">Best</Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sessions:</span>
                        <span className="font-bold">{platform?.sessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Response:</span>
                        <span className="font-bold">{platform?.avg_response_time}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction:</span>
                        <span className="font-bold">{platform?.satisfaction}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversion:</span>
                        <span className="font-bold">{(platform?.conversion_rate! * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Performance Indicators */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Response Time</span>
                        <span>{platform?.avg_response_time! <= 2 ? 'Good' : platform?.avg_response_time! <= 3 ? 'Fair' : 'Poor'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${platform?.avg_response_time! <= 2 ? 'bg-green-500' :
                            platform?.avg_response_time! <= 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{
                            width: `${Math.max(20, Math.min(100, (5 - platform?.avg_response_time!) * 20))}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        )}
      </CardContent>
    </Card>
  );
};