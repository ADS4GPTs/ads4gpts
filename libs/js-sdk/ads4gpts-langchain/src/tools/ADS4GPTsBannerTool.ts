import { ADS4GPTsTool } from './ADS4GPTsTool';
import { ADS4GPTsAPI } from '../lib/api/ADS4GPTsAPI';
import tools from '../lib/config/toolsConfig';
import { getConfigValue } from '../lib/utils';

export class ADS4GPTsBannerTool extends ADS4GPTsTool {
    /**
     * Constructs an instance of the ADS4GPTsBannerTool.
     *
     * @param args - A record of key-value pairs, including an optional API key.
     * @param args.apiKey - Ads4GPTs API key. If not provided, it will attempt to retrieve it from the `ADS4GPTS_API_KEY` environment variable.
     *
     * @throws Error if the API key is missing or the banner tool configuration is not found.
     */
    constructor(args: { apiKey?: string; rootUrl?: string } = {}) {
        const baseUrl = args.rootUrl || 'https://with.ads4gpts.com';
        const ads4gptsApiKey = getConfigValue(
            args,
            'apiKey',
            'ADS4GPTS_API_KEY'
        );
        const ads4gptsAPI = new ADS4GPTsAPI(ads4gptsApiKey, baseUrl);

        const bannerToolConfig = tools.find(
            (tool) => tool.name === 'ads4gpts_banner_tool'
        );

        if (!bannerToolConfig) {
            throw new Error('Banner tool configuration not found.');
        }

        super(
            ads4gptsAPI,
            bannerToolConfig.name,
            bannerToolConfig.url,
            bannerToolConfig.description,
            bannerToolConfig.parameters
        );
    }
}
