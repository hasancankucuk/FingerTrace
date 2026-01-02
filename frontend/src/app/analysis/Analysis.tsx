import { ExportButtons } from "@/components/ExportButtons";
import { HttpErrorHandler } from "@/components/helpers/HttpErrorHandler";
import { CardSkeleton } from "@/components/landing/CardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useSocket } from "@/hooks/useSocket";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useAnalysisQuery } from "@/queries/analysisQueries";
import { downloadBlob, exportAnalyticsPDF } from "@/services/export";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast, Toaster } from "sonner";

export const Analysis = () => {
  const [period, setPeriod] = useState<number>(7);
  const { workspace } = useWorkspace();
  const { t } = useTranslation();

  useSocket(workspace?.id, 'analysis_update', ['analysis', workspace?.id]);

  const {
    data: analysisData,
    isLoading,
    error: analysisError
  } = useAnalysisQuery(workspace?.id || "", period);

  if (analysisError) {
    HttpErrorHandler(analysisError);
  }

  if (
    !analysisData
    || (!Array.isArray(analysisData.apiUsage)
      || analysisData.apiUsage.length === 0)
    && !(analysisData.usage
      || analysisData.uniqueVisitors)) {
    toast.info(t("analysis.no_data"));
  }

  const handlePDFExport = async () => {
    if (!workspace?.id || !analysisData) {
      toast.error('Workspace or data not found');
      return;
    }

    try {
      toast.info('PDF oluşturuluyor...');
      const blob = await exportAnalyticsPDF(workspace.id, analysisData);
      downloadBlob(blob, `analytics_${period}days_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF indirildi!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('PDF export başarısız oldu');
    }
  };


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
    analysisData?.apiUsage && Array.isArray(analysisData.apiUsage) && analysisData?.apiUsageLabels && Array.isArray(analysisData.apiUsageLabels)
      ? analysisData.apiUsage.map((usage, i) => ({
        day: new Date(analysisData.apiUsageLabels[i]).toLocaleDateString() || `Day ${i + 1}`,
        usage: typeof usage === "number" ? usage : 0
      }))
      : [];

  const firstRow = chartData[0] ?? {};
  const hasUsageSeries = "usage" in firstRow;
  const hasDesktopSeries = "desktop" in firstRow;
  const hasMobileSeries = "mobile" in firstRow;

  return (
    <>
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        {isLoading && !analysisData ? (
          <CardSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("analysis.title")}</CardTitle>
                <ExportButtons
                  data={[
                    {
                      period: `Last ${period} days`,
                      usage: analysisData?.usage || 0,
                      uniqueVisitors: analysisData?.uniqueVisitors || 0,
                      eventsPerVisitor: analysisData?.eventsPerVisitor || 0,
                      topBrowsers: analysisData?.topBrowsers?.join(', ') || '',
                      topTimezones: analysisData?.timezones?.join(', ') || '',
                    }
                  ]}
                  columns={[
                    { key: 'period', label: 'Period' },
                    { key: 'usage', label: 'Total Usage' },
                    { key: 'uniqueVisitors', label: 'Unique Visitors' },
                    { key: 'eventsPerVisitor', label: 'Events per Visitor' },
                    { key: 'topBrowsers', label: 'Top Browsers' },
                    { key: 'topTimezones', label: 'Top Timezones' },
                  ]}
                  filename={`analytics_${period}days_${new Date().toISOString().split('T')[0]}`}
                  onExportPDF={handlePDFExport}
                  disabled={isLoading}
                />
              </div>
            </CardHeader>
            <div className="relative">
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-6 px-4 py-6">
                  <div className="flex items-center gap-4 mb-2">
                    <label className="text-sm font-medium">{t("analysis.period")}</label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(Number(e.target.value))}
                      className="p-2 border rounded"
                    >
                      <option value={7}>{t("analysis.last_7_days")}</option>
                      <option value={30}>{t("analysis.last_30_days")}</option>
                      <option value={90}>{t("analysis.last_90_days")}</option>
                      <option value={365}>{t("analysis.last_1_year")}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("analysis.usage")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold">{analysisData?.usage ?? "-"}</span>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("analysis.unique_visitors")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold">
                          {analysisData?.uniqueVisitors ?? "-"}
                        </span>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("analysis.events_per_visitor")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-2xl font-bold">
                          {analysisData?.eventsPerVisitor ?? "-"}
                        </span>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("analysis.api_usage_title", { period })}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        {chartData.length === 0 ? (
                          <div className="flex items-center justify-center min-h-[200px]">
                            <span className="text-muted-foreground">{t("analysis.no_data")}</span>
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
                              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
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
                        <CardTitle>{t("analysis.top_browsers")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {analysisData?.topBrowsers?.length ? (
                          <ul className="space-y-2">
                            {analysisData.topBrowsers.map((b) => (
                              <li key={b.name} className="flex justify-between items-center text-sm">
                                <span>{b.name}</span>
                                <span className="font-medium">{b.count}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground">{t("analysis.no_data")}</span>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t("analysis.top_timezones")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {analysisData?.timezones?.length ? (
                          <ul className="space-y-2">
                            {analysisData.timezones.map((c) => (
                              <li key={c.name} className="flex justify-between items-center text-sm">
                                <span>{c.name}</span>
                                <span className="font-medium">{c.count}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground">{t("analysis.no_data")}</span>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};
