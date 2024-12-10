import Ads4GPTsToolkit from '../src/toolkit';
import { ads4gptsBannerTool, ads4gptsChatTool } from '../src/tools';

jest.mock('../src/tools', () => ({
    ads4gptsBannerTool: jest.fn(),
    ads4gptsChatTool: jest.fn(),
}));

describe('Ads4GPTsToolkit', () => {
    const API_KEY = 'test-api-key';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a record of tools initialized with the API key', () => {
        // Mock the tools to return dummy values
        (ads4gptsBannerTool as jest.Mock).mockReturnValue('mockedBannerTool');
        (ads4gptsChatTool as jest.Mock).mockReturnValue('mockedChatTool');

        const toolkit = new Ads4GPTsToolkit(API_KEY);
        const tools = toolkit.getTools();

        expect(tools).toEqual({
            ads4gpts_banner_tool: 'mockedBannerTool',
            ads4gpts_chat_tool: 'mockedChatTool',
        });

        // Verify that the tools were called with the API key
        expect(ads4gptsBannerTool).toHaveBeenCalledWith(API_KEY);
        expect(ads4gptsChatTool).toHaveBeenCalledWith(API_KEY);
    });

    it('should throw an error if no API key is provided and no environment variable is set', () => {
        // Clear the environment variable for this test
        const originalEnvKey = process.env.ADS4GPTS_API_KEY;
        delete process.env.ADS4GPTS_API_KEY;

        expect(() => {
            new Ads4GPTsToolkit();
        }).toThrowError(
            'Missing API key. Provide it in the constructor or set ADS4GPTS_API_KEY env var.'
        );

        // Restore the environment variable
        process.env.ADS4GPTS_API_KEY = originalEnvKey;
    });

    it('should use the environment variable if no API key is provided in the constructor', () => {
        // Set the environment variable
        const originalEnvKey = process.env.ADS4GPTS_API_KEY;
        process.env.ADS4GPTS_API_KEY = 'env-api-key';

        const toolkit = new Ads4GPTsToolkit();
        const tools = toolkit.getTools();

        expect(tools).toBeDefined();
        expect(ads4gptsBannerTool).toHaveBeenCalledWith('env-api-key');
        expect(ads4gptsChatTool).toHaveBeenCalledWith('env-api-key');

        // Restore the environment variable
        process.env.ADS4GPTS_API_KEY = originalEnvKey;
    });
});
