import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Table as ReactTable } from "@tanstack/react-table";
import { Check, Globe, Info, MapPin, Shield, Wifi, X as XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface IdentificationDetailModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    table: ReactTable<any>;
}

export const IdentificationDetailModal = ({ open, setOpen, table }: IdentificationDetailModalProps) => {
    const { t } = useTranslation();

    const selectedRows = table.getSelectedRowModel().rows;
    const rowData = selectedRows.length > 0 ? selectedRows[0].original : null;

    if (!rowData) return null;

    const locationFields = ['current_location', 'previous_location', 'is_fast_travel'];
    const securityFields = ['is_vpn', 'vpn_details'];
    const featureFields = ['browser_feature_support', 'bar_visibility'];
    const technicalFields = ['user_agent', 'platform', 'color_gamut', 'color_depth', 'device_type', 'time_zone', 'ip', 'request_id', 'fingerprint', 'created_at', 'updated_at'];

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="min-w-full max-h-[95vh] overflow-y-auto">
                <AlertDialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <AlertDialogTitle className="text-xl">{t("identification.details")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("identification.technical_specs")}
                        </AlertDialogDescription>
                    </div>
                    <AlertDialogCancel className="border-none p-0 h-auto hover:bg-transparent" onClick={() => setOpen(false)}>
                        <XIcon className="h-5 w-5" />
                    </AlertDialogCancel>
                </AlertDialogHeader>

                <div className="space-y-6 mt-4">
                    <Section title="Location Info" icon={<Globe className="h-4 w-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {locationFields.map(key => (
                                rowData[key] !== undefined && <DetailRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} type={key} />
                            ))}
                        </div>
                    </Section>

                    <Section title="Security & Network" icon={<Shield className="h-4 w-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {securityFields.map(key => (
                                rowData[key] !== undefined && <DetailRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} type={key} />
                            ))}
                        </div>
                    </Section>


                    {(rowData.browser_feature_support || rowData.bar_visibility) && (
                        <Section title="Browser Features" icon={<Wifi className="h-4 w-4" />}>
                            <div className="space-y-4">
                                {featureFields.map(key => (
                                    rowData[key] !== undefined && <DetailRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} type={key} />
                                ))}
                            </div>
                        </Section>
                    )}

                    <Section title="Technical Details" icon={<Info className="h-4 w-4" />}>
                        <div className="rounded-md border">
                            <Table>
                                <TableBody>
                                    {technicalFields.map(key => (
                                        rowData[key] !== undefined && <TechnicalRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Section>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
            {icon} {title}
        </h3>
        {children}
    </div>
);


const DetailRow = ({ label, value, type }: { label: string, value: any, type: string }) => {
    if (value === null || value === undefined) return null;

    if (type === 'browser_feature_support' || type === 'bar_visibility') {
        return (
            <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                        <span className="text-xs text-muted-foreground">Source</span>
                        <span className="font-medium">{vpn.source}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Confidence</span>
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

const TechnicalRow = ({ label, value }: { label: string, value: any }) => {
    let displayValue = String(value);

    // Provide generic date formatting for ISO strings
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            displayValue = date.toLocaleString();
        }
    } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
    }

    return (
        <TableRow className="hover:bg-transparent">
            <TableCell className="font-medium bg-muted/50 w-1/3 py-2 border-r text-xs">{label}</TableCell>
            <TableCell className="py-2 text-xs font-mono break-all leading-relaxed">
                {displayValue}
            </TableCell>
        </TableRow>
    );
};