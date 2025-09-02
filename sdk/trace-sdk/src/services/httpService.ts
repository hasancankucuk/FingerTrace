export const fetchData = async (endpoint: string): Promise<any> => {
    try {
        const response = await fetch(`http://159.223.16.108/api/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
    }
};

export const postData = async (endpoint: string, data: unknown): Promise<any> => {
    try {
        const response = await fetch(`http://159.223.16.108/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "fingerprint": data }),
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
        const response = await fetch(`https://api.hasancan.dev/api/v1/${endpoint}`, {
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
