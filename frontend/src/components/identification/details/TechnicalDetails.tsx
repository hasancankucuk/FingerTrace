import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";

interface TechnicalDetailsProps {
    rowData: any;
}

export const TechnicalDetails = ({ rowData }: TechnicalDetailsProps) => {
    const { t } = useTranslation();
    const technicalFields = ['user_agent', 'platform', 'color_gamut', 'color_depth', 'device_type', 'time_zone', 'ip', 'request_id', 'fingerprint', 'created_at', 'updated_at'];

    return (
        <AccordionItem value={"technical_details"}>
            <AccordionTrigger>{t("identification.detail.technical_details")}</AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                    {technicalFields.map(key => (
                        rowData[key] !== undefined && <TechnicalRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} />
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

const TechnicalRow = ({ label, value }: { label: string, value: any }) => {
    let displayValue = String(value);

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
