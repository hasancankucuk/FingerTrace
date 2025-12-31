
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { cn } from "@/lib/utils";
import { ChevronRight, Search as SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Get query from URL or local state
    const query = searchParams.get("q") || "";
    const [inputValue, setInputValue] = useState(query);

    // Use our new hook!
    const { results, isLoading } = useGlobalSearch(query);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setSearchParams({ q: inputValue.trim() });
        } else {
            setSearchParams({});
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                />
                <button type="submit" className="hidden" />
            </form>

            {isLoading ? (
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
