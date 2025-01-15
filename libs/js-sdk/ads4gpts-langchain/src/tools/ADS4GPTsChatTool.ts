import { ADS4GPTsTool } from './ADS4GPTsTool';
import { ADS4GPTsAPI } from '../lib/api/ADS4GPTsAPI';
import tools from '../lib/config/toolsConfig';
import { getConfigValue } from '../lib/utils';

export class ADS4GPTsChatTool extends ADS4GPTsTool {
    /**
     * Constructs an instance of the ADS4GPTsChatTool.
     *
     * @param args - A record of key-value pairs, including an optional API key.
     * @param args.apiKey - Ads4GPTs API key. If not provided, it will attempt to retrieve it from the `ADS4GPTS_API_KEY` environment variable.
     *
     * @throws Error if the API key is missing or the chat tool configuration is not found.
     */
    constructor(args: { apiKey?: string; rootUrl?: string } = {}) {
        const baseUrl = args.rootUrl || 'https://with.ads4gpts.com';
        const ads4gptsApiKey = getConfigValue(
            args,
            'apiKey',
            'ADS4GPTS_API_KEY'
        );
        const ads4gptsAPI = new ADS4GPTsAPI(ads4gptsApiKey, baseUrl);

        const chatToolConfig = tools.find(
            (tool) => tool.name === 'ads4gpts_chat_tool'
        );

        if (!chatToolConfig) {
            throw new Error('Chat tool configuration not found.');
        }

        super(
            ads4gptsAPI,
            chatToolConfig.name,
            chatToolConfig.url,
            chatToolConfig.description,
            chatToolConfig.parameters
        );
    }
}
