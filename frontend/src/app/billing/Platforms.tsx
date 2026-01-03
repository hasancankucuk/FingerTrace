import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { usageQuery, useAnalysisQuery } from "@/queries/analysisQueries";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Monitor, Smartphone, SmartphoneNfc, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Platforms = () => {
    const { workspace } = useWorkspaceStore();
    const { t } = useTranslation()

    const { data: usageData, error: usageError } = usageQuery();

    if (!usageData || usageError) return toast.error(t("common.error"));


    // const { data: analysisData, error: analysisError } = useAnalysisQuery(workspace?.id || "", usageData?.trial_left || 0);
    // if (!analysisData || analysisError) return toast.error(t("common.error"));

    // const platforms = [
    //     { name: "Web", count: analysisData?.platforms?.Web || 0, icon: Monitor, color: "bg-blue-500" },
    //     { name: "iOS", count: analysisData?.platforms?.iOS || 0, icon: Smartphone, color: "bg-gray-800" },
    //     { name: "Android", count: analysisData?.platforms?.Android || 0, icon: SmartphoneNfc, color: "bg-green-500" },

    // ];
// const totalEvents = analysisData!.platforms!.Web + analysisData!.platforms!.iOS + analysisData!.platforms!.Android || 0;

return (
    <>
        <Card className="lg:col-span-2 shadow-none border-border/50">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        {t("common.usage.usage_details", { defaultValue: "Usage Overview" })}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {usageData?.trial_left} {t("common.usage.days", { defaultValue: "days" })}
                    </span>
                </div>
            </CardHeader>
            {/* <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {platforms.map((p) => (
                        <div key={p.name} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-2">
                            <div className="flex items-center justify-between">
                                <p.icon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-bold">{p.count}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{p.name}</p>
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${p.color} transition-all`}
                                        style={{ width: `${totalEvents > 0 ? (p.count / totalEvents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent> */}
        </Card>

    </>
)
}