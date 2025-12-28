import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search as SearchIcon, Key, Layout, ChevronRight, Fingerprint, Settings, FileText, Info, Mail, Library } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getWorkspaces } from "@/services/workspaces";
import { getApiKeys } from "@/services/api_keys";
import { getMergedFingerprints } from "@/services/fingerprint";
import { cn } from "@/lib/utils";

interface SearchResult {
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

export function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const query = searchParams.get("q") || "";

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [inputLocal, setInputLocal] = useState(query);

    useEffect(() => {
        if (!inputLocal.trim()) {
            setResults([]);
            if (query) navigate("/search", { replace: true });
            return;
        }
    }, [inputLocal, query, navigate]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const performSearch = async () => {
            setLoading(true);
            try {
                const workspaces = await getWorkspaces();
                const searchResults: SearchResult[] = [];
                const lowQuery = query.toLowerCase();

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

                const detailPromises = workspaces.slice(0, 5).map(async (ws) => {
                    if (!ws.id) return;
                    try {
                        const [keys, fingerprints] = await Promise.all([
                            getApiKeys(ws.id),
                            getMergedFingerprints(ws.id, { page_size: 100 })
                        ]);

                        keys.forEach(key => {
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

                        fingerprints.data.forEach(fp => {
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
                    } catch (e) {
                        console.error(`Error searching in workspace ${ws.id}:`, e);
                    }
                });

                await Promise.all(detailPromises);
                setResults(searchResults);
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputLocal.trim()) {
            navigate(`/search?q=${encodeURIComponent(inputLocal.trim())}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("search.title")}</h1>
                <p className="text-muted-foreground">
                    {t("search.description")}
                </p>
            </div>

            <form onSubmit={handleSearch} className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    className="pl-10 h-12 text-lg shadow-sm focus-visible:ring-1 focus-visible:ring-primary transition-all"
                    placeholder={t("search.input_placeholder")}
                    value={inputLocal}
                    onChange={(e) => setInputLocal(e.target.value)}
                    autoFocus
                />
                <button type="submit" className="hidden" />
            </form>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Spinner className="size-10 text-primary" />
                    <p className="text-muted-foreground animate-pulse">{t("search.searching")}</p>
                </div>
            ) : results.length > 0 ? (
                <div className="grid gap-4">
                    <p className="text-sm font-medium text-muted-foreground px-1">
                        {t("search.found_results", { count: results.length, query })}
                    </p>
                    {results.map((result) => (
                        <Card
                            key={`${result.category}-${result.id}`}
                            className="group hover:border-primary/50 transition-colors cursor-pointer shadow-sm"
                            onClick={() => navigate(result.link)}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={cn(
                                    "p-2 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors",
                                    result.category === "workspace" && "text-blue-500",
                                    result.category === "api_key" && "text-amber-500",
                                    result.category === "fingerprint" && "text-purple-500",
                                    result.category === "page" && "text-indigo-500"
                                )}>
                                    <result.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold truncate">{result.title}</h3>
                                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted font-bold text-muted-foreground text-xs uppercase">
                                            {result.category.replace("_", " ")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : query ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <div className="p-4 rounded-full bg-muted mb-2">
                        <SearchIcon className="h-8 w-8 text-muted-foreground opacity-20" />
                    </div>
                    <h2 className="text-xl font-semibold">{t("common.no_results")}</h2>
                    <p className="text-muted-foreground max-w-xs">
                        {t("common.no_results_desc", { query })}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-2 border-2 border-dashed rounded-xl border-muted/50">
                    <p className="text-muted-foreground">{t("search.empty_state")}</p>
                </div>
            )}
        </div>
    );
}
