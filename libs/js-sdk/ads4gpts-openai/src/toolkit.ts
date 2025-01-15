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

    /**
     *
     * @param args - (apiKey, baseUrl) override or environment-based config.
     * @param args.apiKey - (optional) The ADS4GPTs API key to use for the tool.
     * You can either pass it as an argument or set it as an environment variable.
     * @param args.baseUrl - (optional) The base URL for the ADS4GPTs API service. It
     * defaults to the ADS4GPTS API URL.
     */
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
     * Returns an **array** with all ADS4GPTs tools for use in OpenAI Chat Completion.
     * The chatCompletionMethod parameter specifies the correct tool type depending on
     * the chat completion method used.
     *
     * @param chatCompletionMethod - Use the value 'stream' for tools used with create() and stream() chat completion
     * methods or the value 'run-tool' for tools used with runTools() chat completion method.
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
     * Directly executes the specified tool's function.
     *
     * @param toolType - The type of the tool.
     * Use the value 'ads4gpts_banner_tool' for Banner ads or the value 'ads4gpts_chat_tool' for
     * In-Chat ads.
     * @param args - The arguments for the specified tool's function.
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
