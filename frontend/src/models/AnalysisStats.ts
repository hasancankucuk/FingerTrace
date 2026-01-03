export interface AnalysisStats {
  usage: number;
  uniqueVisitors: number;
  eventsPerVisitor: number;
  apiUsage: number[];
  apiUsageLabels: string[];
  topBrowsers: Array<{ name: string; count: number }>;
  timezones: Array<{ name: string; count: number }>;
  platforms?: {
    Web: number;
    iOS: number;
    Android: number;
    Other: number;
  };
}

export interface UsageDetails {
  usage: number;
  limit: number;
  remaining: number;
  is_trial: boolean;
  status: string
  trial_left: number
}