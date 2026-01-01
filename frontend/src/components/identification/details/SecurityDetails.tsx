import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { DetailRow } from "./DetailRow";

interface SecurityDetailsProps {
    rowData: any;
}

export const SecurityDetails = ({ rowData }: SecurityDetailsProps) => {
    const { t } = useTranslation();
    const securityFields = ['is_vpn', 'vpn_details'];

    return (
        <AccordionItem value={"security_and_network"}>
            <AccordionTrigger>{t("identification.detail.security_and_network")}</AccordionTrigger>
            <AccordionContent>
                <div className="grid grid-cols-1 gap-4">
                    {securityFields.map(key => (
                        rowData[key] !== undefined && <DetailRow key={key} label={t(`identification.detail.${key}`)} value={rowData[key]} type={key} />
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
