import type { CoreTool } from 'ai';
import { ADS4GPTsBannerTool, ADS4GPTsChatTool } from './tools';

class ADS4GPTsToolkit {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey?: string, baseUrl?: string) {
        this.apiKey = apiKey || process.env.ADS4GPTS_API_KEY || '';
        this.baseUrl = baseUrl || 'https://with.ads4gpts.com';
        if (!this.apiKey) {
            throw new Error(
                'Missing API key. Provide it in the constructor or set ADS4GPTS_API_KEY env var.'
            );
        }
    }
    /**
     * Returns a record of all Ads4GPTs tools.
     */
    getTools(): Record<string, CoreTool> {
        return {
            ads4gpts_banner_tool: ADS4GPTsBannerTool(this.apiKey, this.baseUrl),
            ads4gpts_chat_tool: ADS4GPTsChatTool(this.apiKey, this.baseUrl),
        };
    }
}

export default ADS4GPTsToolkit;
