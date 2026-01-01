import { getToken } from './auth';

export const exportFingerprintsPDF = async (
    workspaceId: string
): Promise<Blob> => {
    const token = getToken();

    const response = await fetch(
        `${import.meta.env.VITE_APP_URL}/export/fingerprints/pdf`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ workspace_id: workspaceId })
        }
    );

    if (!response.ok) {
        throw new Error('PDF export failed');
    }

    return await response.blob();
};

export const exportAnalyticsPDF = async (
    workspaceId: string,
    analyticsData: any
): Promise<Blob> => {
    const token = getToken();

    const response = await fetch(
        `${import.meta.env.VITE_APP_URL}/export/analytics/pdf`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                workspace_id: workspaceId,
                analytics_data: analyticsData
            })
        }
    );

    if (!response.ok) {
        throw new Error('PDF export failed');
    }

    return await response.blob();
};

export const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
