export type AnalysisStats = {
  usage: number
  uniqueVisitors: number
  eventsPerVisitor: number
  apiUsage: number[]
  apiUsageLabels: string[]
  topBrowsers: string[]
  timezones: string[]
}