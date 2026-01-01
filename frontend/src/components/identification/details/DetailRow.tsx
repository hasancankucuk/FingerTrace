import { Check, MapPin, Shield, X as XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DetailRowProps {
    label: string;
    value: any;
    type: string;
}

export const DetailRow = ({ label, value, type }: DetailRowProps) => {
    const { t } = useTranslation();

    if (value === null || value === undefined) return null;

    if (type === 'browser_feature_support' || type === 'bar_visibility') {
        return (
            <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(value).map(([featureName, isSupported]) => (
                        <div key={featureName} className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-xs ${isSupported ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : isSupported === false ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' : 'bg-muted text-muted-foreground'}`}>
                            {isSupported === true ? <Check className="h-3 w-3" /> : isSupported === false ? <XIcon className="h-3 w-3" /> : <span className="h-3 w-3 block bg-gray-400 rounded-full" />}
                            <span className="truncate" title={featureName}>{featureName}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (type === 'current_location' || type === 'previous_location') {
        const loc = value as any;
        if (!loc || Object.keys(loc).length === 0) return null;
        return (
            <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{label}</span>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="font-medium">
                    {loc.city}, {loc.country}
                </div>
                <div className="text-xs text-muted-foreground flex flex-col gap-1">
                    <span>ISP: {loc.isp}</span>
                    <span className="font-mono">Lat: {loc.lat}, Lon: {loc.lon}</span>
                </div>
            </div>
        )
    }

    if (type === 'vpn_details') {
        const vpn = value as any;
        if (!vpn || Object.keys(vpn).length === 0) return null;
        return (
            <div className="p-3 rounded-lg border bg-destructive/5 space-y-2 border-destructive/20">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-destructive">{label}</span>
                    <Shield className="h-4 w-4 text-destructive" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{t("identification.detail.probability")}</span>
                        <span className="font-medium">{(vpn.probability * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'is_vpn' || type === 'is_fast_travel') {
        return (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-surface-50 dark:bg-surface-900/50">
                <span className="text-sm font-medium text-foreground/80">{label}</span>
                <div className={`h-3 w-3 rounded-full shadow-sm transition-all duration-300 ${value ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gray-300 dark:bg-gray-600'}`} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1 p-3 border rounded-lg bg-background">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium break-all">{String(value)}</span>
        </div>
    );
};
