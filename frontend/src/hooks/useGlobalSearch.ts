
import type { WorkspacesType } from "@/models/Workspaces";
import { getApiKeys } from "@/services/api_keys";
import { getMergedFingerprints } from "@/services/fingerprint";
import { getWorkspaces } from "@/services/workspaces";
import { useQueries, useQuery } from "@tanstack/react-query";
import { FileText, Fingerprint, Info, Key, Layout, Library, Mail, Settings } from "lucide-react";

export interface SearchResult {
    id: string;
    title: string;
    description: string;
    category: "workspace" | "api_key" | "fingerprint" | "page";
    link: string;
    icon: React.ElementType;
}

const APP_PAGES = [
    { title: "Dashboard", description: "Main overview and stats", link: "/dashboard", icon: Layout, keywords: ["home", "main", "start"] },
    { title: "Account", description: "Profile, settings and security", link: "/account", icon: Settings, keywords: ["profile", "settings", "password", "user", "me"] },
    { title: "API Keys", description: "Manage your integration keys", link: "/api-keys", icon: Key, keywords: ["tokens", "secrets", "api"] },
    { title: "Analysis", description: "Detailed fingerprint analytics", link: "/analysis", icon: Info, keywords: ["stats", "charts", "data"] },
    { title: "Identification", description: "Real-time fingerprint logs", link: "/identification", icon: Fingerprint, keywords: ["logs", "detection", "history"] },
    { title: "Documentation", description: "Guides and API reference", link: "/docs", icon: Library, keywords: ["help", "guides", "api ref"] },
    { title: "Features", description: "FingerTrace core capabilities", link: "/features", icon: Layout, keywords: ["what is", "about"] },
    { title: "Contact", description: "Get in touch with support", link: "/contact", icon: Mail, keywords: ["support", "help", "email"] },
    { title: "Terms of Service", description: "Legal terms and conditions", link: "/terms", icon: FileText, keywords: ["legal", "contract"] },
    { title: "Privacy Policy", description: "How we handle your data", link: "/privacy", icon: FileText, keywords: ["legal", "data", "gdpr"] },
];

export const useGlobalSearch = (query: string) => {
    const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useQuery<WorkspacesType[]>({
        queryKey: ['workspaces'],
        queryFn: getWorkspaces,
        staleTime: 5 * 60 * 1000,
    });

    const enabled = !!query.trim() && workspaces.length > 0;
    const limitedWorkspaces = workspaces.slice(0, 5); // Limit to avoid too many requests

    const apiKeyQueries = useQueries({
        queries: limitedWorkspaces.map(ws => ({
            queryKey: ['api-keys', ws.id],
            queryFn: () => getApiKeys(ws?.id || ""),
            enabled: enabled,
            staleTime: 10 * 60 * 1000,
        }))
    });

    const fingerprintQueries = useQueries({
        queries: limitedWorkspaces.map(ws => ({
            queryKey: ["fingerprint", ws.id, "search-preview"],
            queryFn: () => getMergedFingerprints(ws?.id || "", {
                page_size: 100, // Fetch a chunk to search client side
                page: 0,
                sort_field: "",
                sort_direction: "asc",
                search: ""
            }),
            enabled: enabled,
            staleTime: 10 * 60 * 1000,
        }))
    });

    const isLoading = isLoadingWorkspaces ||
        apiKeyQueries.some(q => q.isLoading) ||
        fingerprintQueries.some(q => q.isLoading);

    if (!query.trim()) return { results: [], isLoading: false };

    const lowQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    APP_PAGES.forEach(page => {
        if (
            page.title.toLowerCase().includes(lowQuery) ||
            page.description.toLowerCase().includes(lowQuery) ||
            page.keywords.some(k => k.includes(lowQuery))
        ) {
            searchResults.push({
                id: `page-${page.link}`,
                title: page.title,
                description: page.description,
                category: "page",
                link: page.link,
                icon: page.icon
            });
        }
    });

    workspaces.forEach(ws => {
        if (ws.name?.toLowerCase().includes(lowQuery)) {
            searchResults.push({
                id: ws?.id || "",
                title: ws.name,
                description: "Workspace",
                category: "workspace",
                link: "/dashboard",
                icon: Layout
            });
        }
    });

    apiKeyQueries.forEach((q, idx) => {
        if (q.data) {
            const ws = limitedWorkspaces[idx];
            q.data.forEach(key => {
                if (key.name?.toLowerCase().includes(lowQuery) ||
                    key.environment?.toLowerCase().includes(lowQuery)) {
                    searchResults.push({
                        id: key.key,
                        title: key.name || "Unnamed Key",
                        description: `API Key in ${ws.name} (${key.environment || "dev"})`,
                        category: "api_key",
                        link: "/api-keys",
                        icon: Key
                    });
                }
            });
        }
    });

    fingerprintQueries.forEach((q, idx) => {
        if (q.data?.data) {
            const ws = limitedWorkspaces[idx];
            q.data.data.forEach(fp => {
                if (fp.fingerprint.toLowerCase().includes(lowQuery) ||
                    fp.platform?.toLowerCase().includes(lowQuery) ||
                    fp.device_type?.toLowerCase().includes(lowQuery)) {
                    searchResults.push({
                        id: fp.request_id || fp.fingerprint,
                        title: fp.fingerprint.substring(0, 16) + "...",
                        description: `Fingerprint in ${ws.name} (${fp.platform}, ${fp.device_type})`,
                        category: "fingerprint",
                        link: "/identification",
                        icon: Fingerprint
                    });
                }
            });
        }
    });

    return { results: searchResults, isLoading };
};
