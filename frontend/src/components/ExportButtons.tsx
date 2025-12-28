import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, type ExportColumn } from '@/utils/exportCSV';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonsProps {
    data: any[];
    columns: ExportColumn[];
    filename: string;
    onExportPDF?: () => void;
    disabled?: boolean;
}

export const ExportButtons = ({
    data,
    columns,
    filename,
    onExportPDF,
    disabled = false
}: ExportButtonsProps) => {
    const handleCSVExport = () => {
        try {
            exportToCSV(data, columns, filename);
            toast.success('CSV dosyası indirildi!');
        } catch (error) {
            console.error('CSV export error:', error);
            toast.error('CSV export başarısız oldu');
        }
    };

    const handlePDFExport = () => {
        if (onExportPDF) {
            onExportPDF();
        } else {
            toast.info('PDF export yakında eklenecek');
        }
    };

    const hasData = data && data.length > 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled || !hasData}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCSVExport} disabled={!hasData}>
                    <FileText className="h-4 w-4 mr-2" />
                    CSV olarak indir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePDFExport} disabled={!hasData}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF olarak indir
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
