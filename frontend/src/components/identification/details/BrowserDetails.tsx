import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { DetailRow } from "./DetailRow";

interface BrowserDetailsProps {
    rowData: any;
}

export const BrowserDetails = ({ rowData }: BrowserDetailsProps) => {
    const { t } = useTranslation();
    const featureFields = ['browser_feature_support', 'bar_visibility'];

    if (!rowData.browser_feature_support && !rowData.bar_visibility) return null;

    return (
        <AccordionItem value={"browser_features"}>
            <AccordionTrigger>{t("identification.detail.browser_features")}</AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1  gap-4">
                    {featureFields.map(key => (
                        rowData[key] !== undefined && <DetailRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} type={key} />
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
