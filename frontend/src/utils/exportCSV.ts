export interface ExportColumn {
    key: string;
    label: string;
    format?: (value: any) => string;
}

export const exportToCSV = (
    data: any[],
    columns: ExportColumn[],
    filename: string
) => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Create CSV header
    const headers = columns.map(col => col.label).join(',');

    // Create CSV rows
    const rows = data.map(item => {
        return columns.map(col => {
            let value = item[col.key];

            // Apply custom formatting if provided
            if (col.format && value !== undefined && value !== null) {
                value = col.format(value);
            }

            // Handle undefined/null
            if (value === undefined || value === null) {
                return '';
            }

            // Escape commas and quotes
            value = String(value);
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }

            return value;
        }).join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Helper function for date formatting
export const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';

    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch {
        return '';
    }
};

// Helper function for boolean formatting
export const formatBoolean = (value: boolean): string => {
    return value ? 'Evet' : 'Hayır';
};

// Helper function for truncating long strings
export const truncateString = (str: string, maxLength: number = 50): string => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};
