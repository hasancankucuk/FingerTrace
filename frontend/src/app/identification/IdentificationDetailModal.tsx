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
import { X } from "lucide-react";
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
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <AlertDialogTitle>{t("identification.details")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("identification.technical_specs")}
                        </AlertDialogDescription>
                    </div>
                    <AlertDialogCancel className="border-none p-0 h-auto hover:bg-transparent" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </AlertDialogCancel>
                </AlertDialogHeader>

                <div className="rounded-md border mt-4">
                    <Table>
                        <TableBody>
                            {Object.entries(rowData).map(([key, value]) => (
                                <DetailRow key={key} label={t(`identification.detail.${key}`)} value={value} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const DetailRow = ({ label, value, isMono = false, className = "" }: { label: string, value: any, isMono?: boolean, className?: string }) => {
    // Convert objects to JSON string for display
    const displayValue = typeof value === 'object' && value !== null
        ? JSON.stringify(value, null, 2)
        : value;

    return (
        <TableRow className="hover:bg-transparent">
            <TableCell className="font-medium bg-muted/50 w-1/3 py-3 border-r">{label}</TableCell>
            <TableCell className={`py-3 ${isMono ? "font-mono text-[11px]" : "text-sm"} ${className}`}>
                {displayValue || "-"}
            </TableCell>
        </TableRow>
    );
};