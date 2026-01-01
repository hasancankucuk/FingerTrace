import { Bug, Check, Clock, Copy, HeadphonesIcon, Mail, MapPin } from "lucide-react"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"; // Shadcn varsayılan utility

interface ContactMethod {
    id: string
    icon: React.ReactNode
    email: string
    titleKey: string
    descKey: string
}

const ContactItem = ({
    method,
    onCopy,
    isCopied,
    t
}: {
    method: ContactMethod,
    onCopy: (email: string) => void,
    isCopied: boolean,
    t: any
}) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
        <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
            {method.icon}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">{t(method.titleKey)}</h4>
            <p className="text-xs text-muted-foreground mb-2">{t(method.descKey)}</p>

            <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded truncate">
                    {method.email}
                </code>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopy(method.email)}
                    className="h-8 w-8 p-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Copy email"
                >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
                {isCopied && (
                    <span className="text-[10px] font-medium text-green-600 animate-in fade-in slide-in-from-left-1">
                        {t("contact.info.copied")}
                    </span>
                )}
            </div>
        </div>
    </div>
)

export const ContactMethods = () => {
    const { t } = useTranslation()
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

    const methods: ContactMethod[] = useMemo(() => [
        {
            id: "support",
            icon: <Mail className="h-5 w-5" />,
            email: "support@fingertrace.app",
            titleKey: "contact.info.methods.email.title",
            descKey: "contact.info.methods.email.description",
        },
        {
            id: "security",
            icon: <Bug className="h-5 w-5" />,
            email: "security@fingertrace.app",
            titleKey: "contact.info.methods.security.title",
            descKey: "contact.info.methods.security.description",
        },
        {
            id: "tech",
            icon: <HeadphonesIcon className="h-5 w-5" />,
            email: "tech@fingertrace.app",
            titleKey: "contact.info.methods.tech.title",
            descKey: "contact.info.methods.tech.description",
        },
    ], [])

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email)
            setCopiedEmail(email)
            setTimeout(() => setCopiedEmail(null), 2000)
        } catch (err) {
            console.error("Clipboard error:", err)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-1">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>{t("contact.info.title")}</CardTitle>
                    <CardDescription>{t("contact.info.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {methods.map((method) => (
                        <ContactItem
                            key={method.id}
                            method={method}
                            t={t}
                            onCopy={handleCopyEmail}
                            isCopied={copiedEmail === method.email}
                        />
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {t("contact.response_time.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                    <ResponseTimeRow label={t("contact.response_time.general")} time={t("contact.response_time.hours_24")} />
                    <ResponseTimeRow label={t("contact.response_time.technical")} time={t("contact.response_time.hours_12")} />
                    <ResponseTimeRow label={t("contact.response_time.security")} time={t("contact.response_time.hours_2")} highlight />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {t("contact.office_hours.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <ResponseTimeRow label={t("contact.office_hours.mon_fri")} time="9:00 AM - 6:00 PM EST" />
                    <ResponseTimeRow label={t("contact.office_hours.sat")} time="10:00 AM - 2:00 PM EST" />
                    <ResponseTimeRow label={t("contact.office_hours.sun")} time={t("contact.office_hours.closed")} muted />
                </CardContent>
            </Card>
        </div >
    )
}

const ResponseTimeRow = ({ label, time, highlight, muted }: { label: string, time: string, highlight?: boolean, muted?: boolean }) => (
    <div className="flex justify-between items-center border-b border-border/40 pb-2 last:border-0 last:pb-0">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
            "font-medium",
            highlight && "text-red-600",
            muted && "text-muted-foreground/60"
        )}>
            {time}
        </span>
    </div>
)