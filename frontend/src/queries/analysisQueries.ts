import type { AnalysisStats } from "@/models/AnalysisStats"
import { getAnalysis } from "@/services/analysis"
import { useQuery } from "@tanstack/react-query"

export const useAnalysisQuery = (workspaceId: string, period: number) => {
    return useQuery<AnalysisStats, Error>({
        queryKey: ['analysis', workspaceId, period],
        queryFn: () => getAnalysis(period, workspaceId),
        staleTime: 20000,
        refetchInterval: 30000,
        retry: false,
        enabled: !!workspaceId,
    })
}