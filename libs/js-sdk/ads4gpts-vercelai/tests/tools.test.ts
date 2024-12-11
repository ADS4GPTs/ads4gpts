import { ADS4GPTsChatTool, ADS4GPTsBannerTool } from '../src/tools';

describe('ADS4GPTs Tools', () => {
    const API_KEY = 'test-api-key';
    const mockToolExecutionOptions = {
        toolCallId: 'test-tool-call-id',
        messages: [
            {
                role: 'user' as 'user',
                content: 'What are the best travel deals?',
            },
            {
                role: 'system' as 'system',
                content: 'Fetching ads for travel deals...',
            },
        ],
        abortSignal: new AbortController().signal,
    };

    beforeEach(() => {
        global.fetch = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('ADS4GPTsBannerTool', () => {
        it('should log and throw an error if fetching banner ads fails', async () => {
            const errorMessage = 'Network error';
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error(errorMessage)
            );

            const bannerTool = ADS4GPTsBannerTool(API_KEY);

            await expect(
                bannerTool.execute(
                    { context: 'test-context', num_ads: 1 },
                    mockToolExecutionOptions
                )
            ).rejects.toThrow(
                `ads4gpts_banner_tool failed: Failed to fetch after 5 attempts: ${errorMessage}`
            );

            // Verify all retry logs
            expect(console.error).toHaveBeenNthCalledWith(
                1,
                `Fetch attempt 1/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                2,
                `Fetch attempt 2/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                3,
                `Fetch attempt 3/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                4,
                `Fetch attempt 4/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                5,
                `Fetch attempt 5/5 failed: ${errorMessage}`
            );

            // Verify final error log from the tool
            expect(console.error).toHaveBeenLastCalledWith(
                `Error retrieving banner ads: Failed to fetch after 5 attempts: ${errorMessage}`
            );
        });
    });

    describe('ADS4GPTsChatTool', () => {
        it('should log and throw an error if fetching chat ads fails', async () => {
            const errorMessage = 'Timeout error';
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error(errorMessage)
            );

            const chatTool = ADS4GPTsChatTool(API_KEY);

            await expect(
                chatTool.execute(
                    { context: 'test-context', num_ads: 1 },
                    mockToolExecutionOptions
                )
            ).rejects.toThrow(
                `ads4gpts_chat_tool failed: Failed to fetch after 5 attempts: ${errorMessage}`
            );

            // Verify all retry logs
            expect(console.error).toHaveBeenNthCalledWith(
                1,
                `Fetch attempt 1/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                2,
                `Fetch attempt 2/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                3,
                `Fetch attempt 3/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                4,
                `Fetch attempt 4/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                5,
                `Fetch attempt 5/5 failed: ${errorMessage}`
            );

            // Verify final error log from the tool
            expect(console.error).toHaveBeenLastCalledWith(
                `Error retrieving chat ads: Failed to fetch after 5 attempts: ${errorMessage}`
            );
        });
    });
});
