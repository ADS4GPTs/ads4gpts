import { getConfigValue } from './lib/utils';
import { ADS4GPTsBannerTool } from './tools/ADS4GPTsBannerTool';
import { ADS4GPTsChatTool } from './tools/ADS4GPTsChatTool';
import { BannerAdData, BannerAdsPayload } from './types/bannerAds';
import { ChatAdData, ChatAdsPayload } from './types/chatAds';
import { RunnableToolFunctionWithParse } from 'openai/lib/RunnableFunction.mjs';
import { ChatCompletionTool } from 'openai/resources/index.mjs';

class ADS4GPTsToolkit {
    private apiKey: string;
    private baseUrl: string;

    private bannerTool: ADS4GPTsBannerTool;
    private chatTool: ADS4GPTsChatTool;

    constructor(args: { apiKey?: string; baseUrl?: string } = {}) {
        this.apiKey = getConfigValue(args, 'apiKey', 'ADS4GPTS_API_KEY');
        this.baseUrl = args.baseUrl || 'https://with.ads4gpts.com';

        // Initialize tools
        this.bannerTool = new ADS4GPTsBannerTool({
            apiKey: this.apiKey,
            baseUrl: this.baseUrl,
        });
        this.chatTool = new ADS4GPTsChatTool({
            apiKey: this.apiKey,
            baseUrl: this.baseUrl,
        });
    }

    /**
     * Overloads to ensure correct inference of return type based on `chatCompletionMethod` value.
     */

    /**
     * Returns an array of all Ads4GPTs tools.
     * Each tool is returned based on the specified chatCompletionMethod.
     *
     * @param chatCompletionMethod - 'stream' or 'run-tool'
     */
    public getTools(chatCompletionMethod: 'stream'): ChatCompletionTool[];
    public getTools(
        chatCompletionMethod: 'run-tool'
    ): RunnableToolFunctionWithParse<any>[];
    public getTools(
        chatCompletionMethod: 'stream' | 'run-tool'
    ): (ChatCompletionTool | RunnableToolFunctionWithParse<any>)[] {
        if (chatCompletionMethod === 'stream') {
            return [
                ...this.bannerTool.getTool('stream'),
                ...this.chatTool.getTool('stream'),
            ];
        } else {
            return [
                ...this.bannerTool.getTool('run-tool'),
                ...this.chatTool.getTool('run-tool'),
            ];
        }
    }

    /**
     * Executes a tool based on its type.
     *
     * @param toolType - The type of the tool ('ads4gpts_banner_tool' or 'ads4gpts_chat_tool').
     * @param args - The arguments for the tool's execute function.
     * @returns The result of the tool's execution.
     */
    public async executeTool(
        toolType: 'ads4gpts_banner_tool' | 'ads4gpts_chat_tool',
        args: BannerAdsPayload | ChatAdsPayload
    ): Promise<BannerAdData | BannerAdData[] | ChatAdData | ChatAdData[]> {
        switch (toolType) {
            case 'ads4gpts_banner_tool':
                return this.bannerTool.execute(args as BannerAdsPayload);
            case 'ads4gpts_chat_tool':
                return this.chatTool.execute(args as ChatAdsPayload);
            default:
                throw new Error(`Invalid tool type: ${toolType}`);
        }
    }
}

export default ADS4GPTsToolkit;
