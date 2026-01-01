import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { DetailRow } from "./DetailRow";

interface LocationDetailsProps {
    rowData: any;
}

export const LocationDetails = ({ rowData }: LocationDetailsProps) => {
    const { t } = useTranslation();
    const locationFields = ['current_location', 'previous_location', 'is_fast_travel'];

    return (
        <AccordionItem value={"location_info"}>
            <AccordionTrigger>{t("identification.detail.location_info")}</AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                    {locationFields.map(key => (
                        rowData[key] !== undefined && <DetailRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} type={key} />
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
