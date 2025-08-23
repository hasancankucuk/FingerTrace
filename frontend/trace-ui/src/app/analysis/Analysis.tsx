import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AnalysisStats } from "@/models/AnalysisStats";
import { toast, Toaster } from "sonner";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useWorkspace } from "@/hooks/useWorkspace";
import { getAnalysis } from "@/services/analysis";

export const Analysis = () => {
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [period, setPeriod] = useState<number>(7);
  const { workspace } = useWorkspace();

  useEffect(() => {
    if (!workspace) {
      setStats(null);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getAnalysis(period, String(workspace.id));
        setStats(data);
        const usageEmpty =
          !data ||
          (!Array.isArray(data.apiUsage) || data.apiUsage.length === 0) &&
          !(data.usage || data.uniqueVisitors || (data.topOrigins && data.topOrigins.length));
        if (usageEmpty) {
          toast.info("No analysis data for the selected workspace / period.");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const status = err?.status;
        const body = err?.body;
        switch (status) {
          case 400:
            toast.error(`Bad request: ${body || "Invalid parameters"}`);
            break;
          case 401:
            toast.error("Unauthorized. Please sign in.");
            break;
          case 403:
            toast.error("Access denied to this workspace.");
            break;
          case 404:
            toast.error("Analysis endpoint not found (404).");
            break;
          case 429:
            toast.error("Rate limited. Try again later.");
            break;
          case 500:
          default:
            toast.error(`Server error: ${body || err?.message || `Status ${status || "unknown"}`}`);
            break;
        }
        console.error("Error fetching analysis data:", err);
        setStats(null);
      }
    };

    fetchData();
  }, [period, workspace]);

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const chartData =
    stats?.apiUsage && Array.isArray(stats.apiUsage)
      ? stats.apiUsage.map((item, i) =>
          typeof item === "number"
            ? { day: `Day ${i + 1}`, usage: item }
            : typeof item === "object" && item !== null
            ? { day: `Day ${i + 1}`, ...(typeof item === "object" && item !== null ? item : {}) }
            : { day: `Day ${i + 1}` }
        )
      : [];

  const firstRow = chartData[0] ?? {};
  const hasUsageSeries = "usage" in firstRow;
  const hasDesktopSeries = "desktop" in firstRow;
  const hasMobileSeries = "mobile" in firstRow;

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
      <div className="flex flex-col gap-6 px-4 py-6">
        <div className="flex items-center gap-4 mb-2">
          <label className="text-sm font-medium">API Usage Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 1 year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{stats?.usage ?? "-"}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {stats?.uniqueVisitors ?? "-"}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events / Visitor</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {stats?.eventsPerVisitor ?? "-"}
              </span>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Usage ({period} days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <span className="text-muted-foreground">No data</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {hasUsageSeries && (
                      <Bar dataKey="usage" fill="var(--color-desktop)" radius={4} />
                    )}
                    {!hasUsageSeries && hasDesktopSeries && (
                      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    )}
                    {!hasUsageSeries && hasMobileSeries && (
                      <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Browsers</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topBrowsers?.length ? (
                <ul>
                  {stats.topBrowsers.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">No data</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Timezones</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topTimezones?.length ? (
                <ul>
                  {stats.topTimezones.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">No data</span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
          </CardContent>
        </Card>
      </div>

    </>
  );
};
