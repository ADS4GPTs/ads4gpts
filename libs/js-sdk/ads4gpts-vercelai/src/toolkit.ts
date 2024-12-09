import type { CoreTool } from 'ai';
import { ads4gptsBannerTool, ads4gptsChatTool } from './tools';
import { ADS4GPTS_API_KEY } from './config';

class Ads4GPTsToolkit {
    /**
     * Returns a record of all Ads4GPTs tools.
     */
    static getTools(): Record<string, CoreTool> {
        return {
            ads4gpts_banner_tool: ads4gptsBannerTool,
            ads4gpts_chat_tool: ads4gptsChatTool,
        };
    }
}

export default Ads4GPTsToolkit;
