import { BrowserDetails } from "@/components/identification/details/BrowserDetails";
import { LocationDetails } from "@/components/identification/details/LocationDetails";
import { SecurityDetails } from "@/components/identification/details/SecurityDetails";
import { TechnicalDetails } from "@/components/identification/details/TechnicalDetails";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Table as ReactTable } from "@tanstack/react-table";
import { Info } from "lucide-react";
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

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{t("identification.details")}</DrawerTitle>
                    <DrawerDescription>{t("identification.technical_specs")}</DrawerDescription>
                </DrawerHeader>

                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <Accordion
                        type="single"
                        className="w-full px-4"
                        defaultValue="location_info"
                        collapsible>
                        <LocationDetails rowData={rowData} />
                        <SecurityDetails rowData={rowData} />
                        <BrowserDetails rowData={rowData} />
                        <TechnicalDetails rowData={rowData} />
                    </Accordion>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
};