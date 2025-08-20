import { FingerprintSDK } from './index';
import { fetchData } from './services/httpService';

jest.mock('./services/httpService');

const mockContext = {
  getContext: jest.fn(),
  toDataURL: jest.fn(() => 'data:image/png;base64,test'),
};

const mockFonts = {
  ready: Promise.resolve(),
  check: jest.fn(() => true),
};

describe('FingerprintIO', () => {
  beforeEach(() => {
    global.document.createElement = jest.fn().mockReturnValue(mockContext);
    Object.defineProperty(global.document, 'fonts', {
      value: mockFonts,
      writable: true,
    });
  });

  it('should generate a fingerprint and detect incognito mode', async () => {
    (fetchData as jest.Mock).mockResolvedValueOnce({
      mathFingerprint: { acos: 1 },
      webglFingerprint: { vendor: 'test' },
    });

    const result = await FingerprintSDK();

    expect(result).toHaveProperty('fingerprint');
    expect(result).toHaveProperty('isIncognito');
  });
});