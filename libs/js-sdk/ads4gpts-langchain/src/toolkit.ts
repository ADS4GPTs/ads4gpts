import { BaseToolkit } from '@langchain/core/tools';
import { ADS4GPTsAPI } from './lib/api/ADS4GPTsAPI';
import { ADS4GPTsTool } from './tools/ADS4GPTsTool';
import tools from './lib/config/toolsConfig';
import { getConfigValue } from './lib/utils';

class ADS4GPTsToolkit implements BaseToolkit {
    private ads4gptsAPI: ADS4GPTsAPI;
    tools: ADS4GPTsTool[];

    /**
     * Constructs the ADS4GPTsToolkit instance and initializes tools.
     * @param args - A record of key-value pairs, including an optional API key.
     * @param args.apiKey - Ads4GPTs API key. If not provided, it will attempt to retrieve it from the `ADS4GPTS_API_KEY` environment variable.
     */
    constructor(args: { apiKey?: string; rootUrl?: string } = {}) {
        const baseUrl = args.rootUrl || 'https://with.ads4gpts.com';
        const ads4gptsApiKey = getConfigValue(
            args,
            'apiKey',
            'ADS4GPTS_API_KEY'
        );

        this.ads4gptsAPI = new ADS4GPTsAPI(ads4gptsApiKey, baseUrl);

        this.tools = tools.map(
            (tool) =>
                new ADS4GPTsTool(
                    this.ads4gptsAPI,
                    tool.name,
                    tool.url,
                    tool.description,
                    tool.parameters
                )
        );
    }

    /**
     * Returns the list of initialized tools.
     * @returns {ADS4GPTsTool[]} Array of tools.
     */
    getTools(): ADS4GPTsTool[] {
        return this.tools;
    }
}

export default ADS4GPTsToolkit;
