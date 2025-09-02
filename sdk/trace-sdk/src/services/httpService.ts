/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchData = async (endpoint: string): Promise<any> => {
    try {
        const response = await fetch(`http://159.223.16.108:5000/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
    }
};

export const postData = async (endpoint: string, data: unknown, workspaceId: string, apiKey: string): Promise<any> => {
    try {
        const response = await fetch(`http://159.223.16.108:5000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "id": data, "workspace": workspaceId, "api_key": apiKey }),
        });
        if (!response.ok) {
            throw new Error(`Error posting data to ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error posting data to ${endpoint}:`, error);
    }
};

export const postAttributes = async (endpoint: string, data: Record<string, any>, fingerprint: string): Promise<any> => {
    const payload = { ...data, fingerprint };
    try {
        const response = await fetch(`http://159.223.16.108:5000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Error posting attributes to ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error posting attributes to ${endpoint}:`, error);
    }
};
