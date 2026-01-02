import type { AnalysisStats, UsageDetails } from "@/models/AnalysisStats"
import { getAnalysis, getUsageDetails } from "@/services/analysis"
import { useQuery } from "@tanstack/react-query"

export const useAnalysisQuery = (workspaceId: string, period: number) => {
    return useQuery<AnalysisStats, Error>({
        queryKey: ['analysis', workspaceId, period],
        queryFn: () => getAnalysis(period, workspaceId),
        staleTime: 60000,
        retry: false,
        enabled: !!workspaceId,
    })
}

export const usageQuery = () => {
    return useQuery<UsageDetails, Error>({
        queryKey: ['usage'],
        queryFn: () => getUsageDetails(),
        staleTime: 60000,
        retry: false,
    })
}