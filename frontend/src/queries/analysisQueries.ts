import { getAnalysis } from "@/services/analysis"
import { useQuery } from "@tanstack/react-query"
import type { AnalysisStats } from "@/models/AnalysisStats"

export const useAnalysisQuery = (workspaceId: string, period: number) => {
    return useQuery<AnalysisStats, Error>({
        queryKey: ['analysis', workspaceId, period],
        queryFn: () => getAnalysis(period, workspaceId),
        staleTime: 10 * 60 * 1000,
        retry: false,
        enabled: !!workspaceId,
    })
}