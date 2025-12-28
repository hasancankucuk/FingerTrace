import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "en", label: "EN", title: "English" },
    { code: "tr", label: "TR", title: "Türkçe" },
    { code: "de", label: "DE", title: "Deutsch" },
];

export function LanguageToggle() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find((l) => l.code === i18n.language.split('-')[0]) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative flex items-center">
            <div
                className={cn(
                    "relative flex items-center h-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-border bg-background/80 backdrop-blur-md shadow-sm overflow-hidden",
                    isOpen ? "w-[128px] rounded-full px-1" : "w-10 rounded-full px-0"
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-full justify-center px-0.5",
                        isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 -translate-x-4 pointer-events-none absolute"
                    )}
                >

                    <div className={cn(
                        "flex items-center w-full px-1 justify-between transition-all duration-500",
                        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
                    )}>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 transform",
                                    lang.code === currentLanguage.code
                                        ? "bg-primary text-primary-foreground shadow-inner scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-90"
                                )}
                                title={lang.title}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Collapsed Trigger */}
                <button
                    onClick={() => setIsOpen(true)}
                    className={cn(
                        "flex items-center justify-center h-10 w-10 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent/30",
                        isOpen ? "opacity-0 scale-50 rotate-90 pointer-events-none absolute" : "opacity-100 scale-100 rotate-0"
                    )}
                >
                    {currentLanguage.label}
                </button>
            </div>
        </div>
    );
}
