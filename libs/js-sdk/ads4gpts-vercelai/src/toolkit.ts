import type { CoreTool } from 'ai';
import { ADS4GPTsBannerTool, ADS4GPTsChatTool } from './tools';

class ADS4GPTsToolkit {
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.ADS4GPTS_API_KEY || '';
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
            ads4gpts_banner_tool: ADS4GPTsBannerTool(this.apiKey),
            ads4gpts_chat_tool: ADS4GPTsChatTool(this.apiKey),
        };
    }
}

export default ADS4GPTsToolkit;
