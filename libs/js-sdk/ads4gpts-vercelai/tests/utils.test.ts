import { initGetAdsFunction } from '../src/utils';

describe('Utils - initGetAdsFunction', () => {
    const API_KEY = 'test-api-key';
    const getAds = initGetAdsFunction(API_KEY, 'https://with.ads4gpts.com');

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return a single ad object when num_ads is 1 and response is a single object', async () => {
        const mockResponse = {
            status: 'success',
            data: {
                ads: {
                    creative: 'Creative Content',
                    header: 'Ad Header',
                    copy: 'Ad Copy',
                    cta_link: 'https://example.com',
                },
            },
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await getAds('/api/v1/banner_ads', {
            context: 'test-context',
            num_ads: 1,
        });

        expect(result).toEqual({
            creative: 'Creative Content',
            header: 'Ad Header',
            copy: 'Ad Copy',
            cta_link: 'https://example.com',
        });
    });

    it('should return a single ad object when num_ads is 1 and response is an array with one item', async () => {
        const mockResponse = {
            status: 'success',
            data: {
                ads: [
                    {
                        creative: 'Creative Content',
                        header: 'Ad Header',
                        copy: 'Ad Copy',
                        cta_link: 'https://example.com',
                    },
                ],
            },
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await getAds('/api/v1/banner_ads', {
            context: 'test-context',
            num_ads: 1,
        });

        expect(result).toEqual({
            creative: 'Creative Content',
            header: 'Ad Header',
            copy: 'Ad Copy',
            cta_link: 'https://example.com',
        });
    });

    it('should return multiple ads when num_ads > 1', async () => {
        const mockResponse = {
            status: 'success',
            data: {
                ads: [
                    {
                        creative: 'Creative Content 1',
                        header: 'Ad Header 1',
                        copy: 'Ad Copy 1',
                        cta_link: 'https://example1.com',
                    },
                    {
                        creative: 'Creative Content 2',
                        header: 'Ad Header 2',
                        copy: 'Ad Copy 2',
                        cta_link: 'https://example2.com',
                    },
                ],
            },
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await getAds('/api/v1/banner_ads', {
            context: 'test-context',
            num_ads: 2,
        });

        expect(result).toEqual([
            {
                creative: 'Creative Content 1',
                header: 'Ad Header 1',
                copy: 'Ad Copy 1',
                cta_link: 'https://example1.com',
            },
            {
                creative: 'Creative Content 2',
                header: 'Ad Header 2',
                copy: 'Ad Copy 2',
                cta_link: 'https://example2.com',
            },
        ]);
    });

    it('should throw an error if no ads are returned', async () => {
        const mockResponse = {
            status: 'success',
            data: {}, // Missing `ads` field
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        await expect(
            getAds('/api/v1/banner_ads', {
                context: 'test-context',
                num_ads: 1,
            })
        ).rejects.toThrow("Invalid response: no 'ads' field found.");
    });

    it('should throw an error if no response is received (undefined response)', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(undefined); // Simulate undefined response

        await expect(
            getAds('/api/v1/banner_ads', {
                context: 'test-context',
                num_ads: 1,
            })
        ).rejects.toThrow('No response received from server. Request failed.');
    });

    it('should retry on transient errors and succeed', async () => {
        const mockResponse = {
            status: 'success',
            data: {
                ads: {
                    creative: 'Creative Content After Retry',
                    header: 'Ad Header',
                    copy: 'Ad Copy',
                    cta_link: 'https://example.com',
                },
            },
        };

        (global.fetch as jest.Mock)
            .mockRejectedValueOnce(new Error('Network error')) // First attempt fails
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse, // Second attempt succeeds
            });

        const result = await getAds('/api/v1/banner_ads', {
            context: 'test-context',
            num_ads: 1,
        });

        expect(result).toEqual({
            creative: 'Creative Content After Retry',
            header: 'Ad Header',
            copy: 'Ad Copy',
            cta_link: 'https://example.com',
        });

        expect(global.fetch).toHaveBeenCalledTimes(2); // Ensure fetch was retried
    });

    it('should throw an error after max retries', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(
            new Error('Network error')
        );

        await expect(
            getAds('/api/v1/banner_ads', {
                context: 'test-context',
                num_ads: 1,
            })
        ).rejects.toThrow('Failed to fetch after 5 attempts: Network error');
    });

    it('should throw an error if response status is not ok', async () => {
        // Mock console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});

        // Mock fetch to always return a response with ok: false
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: false,
                status: 403,
                statusText: 'Forbidden',
            })
        );

        await expect(
            getAds('/api/v1/banner_ads', {
                context: 'test-context',
                num_ads: 1,
            })
        ).rejects.toThrow('HTTP error: 403 Forbidden');

        // Verify all retry logs
        expect(console.error).toHaveBeenNthCalledWith(
            1,
            `Fetch attempt 1/5 failed: HTTP error: 403 Forbidden`
        );
        expect(console.error).toHaveBeenNthCalledWith(
            2,
            `Fetch attempt 2/5 failed: HTTP error: 403 Forbidden`
        );
        expect(console.error).toHaveBeenNthCalledWith(
            3,
            `Fetch attempt 3/5 failed: HTTP error: 403 Forbidden`
        );
        expect(console.error).toHaveBeenNthCalledWith(
            4,
            `Fetch attempt 4/5 failed: HTTP error: 403 Forbidden`
        );
        expect(console.error).toHaveBeenNthCalledWith(
            5,
            `Fetch attempt 5/5 failed: HTTP error: 403 Forbidden`
        );

        // No additional log is expected beyond the 5th retry
        expect(console.error).toHaveBeenCalledTimes(5);

        // Restore console.error after the test
        jest.restoreAllMocks();
    });
});
