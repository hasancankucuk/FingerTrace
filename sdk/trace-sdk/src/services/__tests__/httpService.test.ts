import { fetchData, postData, postAttributes } from '../httpService';

describe('HTTP Service', () => {
    it('should fetch data successfully', async () => {
        const mockResponse = { data: 'test data' };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
                json: () => Promise.resolve(mockResponse),
            } as Response)
        );

        const data = await fetchData('fingerprint');
        expect(data).toEqual(mockResponse);
    });

    it('should post data successfully', async () => {
        const mockResponse = { success: true };
        const mockData = { key: 'value' };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
                json: () => Promise.resolve(mockResponse),
            } as Response)
        );

        const response = await postData('fingerprint', mockData);
        expect(response).toEqual(mockResponse);
    });

    it('should post attributes successfully', async () => {
        const mockResponse = { success: true };
        const mockAttributes = { attribute: 'value' };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
                json: () => Promise.resolve(mockResponse),
            } as Response)
        );

        const response = await postAttributes('deviceinfo', mockAttributes);
        expect(response).toEqual(mockResponse);
    });
});