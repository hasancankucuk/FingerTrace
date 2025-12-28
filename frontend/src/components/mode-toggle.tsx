import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const items = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ] as const

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const currentItem = items.find(item => item.value === theme) || items[2]
    const Icon = currentItem.icon

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex items-center h-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-border bg-background/80 backdrop-blur-md shadow-sm overflow-hidden",
                isOpen ? "w-[128px] rounded-full px-1" : "w-10 rounded-full px-0"
            )}
        >
            {/* Expanded Options */}
            <div
                className={cn(
                    "flex items-center gap-1.5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-full justify-center px-0.5",
                    isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 -translate-x-4 pointer-events-none absolute"
                )}
            >
                {items.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => {
                            setTheme(item.value)
                            setIsOpen(false)
                        }}
                        className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 transform",
                            theme === item.value
                                ? "bg-primary text-primary-foreground shadow-inner scale-105"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:scale-90"
                        )}
                        title={item.label}
                    >
                        <item.icon className="h-4 w-4" />
                    </button>
                ))}
            </div>

            {/* Collapsed Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex items-center justify-center h-10 w-10 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent/30",
                    isOpen ? "opacity-0 scale-50 rotate-90 pointer-events-none absolute" : "opacity-100 scale-100 rotate-0"
                )}
            >
                <Icon className="h-[1.1rem] w-[1.1rem]" />
            </button>
        </div>
    )
}