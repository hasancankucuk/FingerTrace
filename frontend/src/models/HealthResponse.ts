export type HealthResponse = {
  status: string
  checks: Record<string, string>
}