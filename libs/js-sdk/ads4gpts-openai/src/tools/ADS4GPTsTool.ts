import { ChatCompletionTool } from 'openai/resources/index.mjs';
import { RunnableToolFunctionWithParse } from 'openai/lib/RunnableFunction.mjs';
import {
    getConfigValue,
    getToolConfig,
    initGetAdsFunction,
    zodFunction,
} from '../lib/utils';
import { ZodType } from 'zod';

/**
 * An abstract class to centralize common logic for Ads4GPTs Tools.
 * @typeParam P - The payload type (e.g., BannerAdsPayload or ChatAdsPayload).
 * @typeParam R - The return type (e.g., BannerAdData | BannerAdData[], etc.).
 */
export abstract class ADS4GPTsTool<
    P extends object,
    // R extends (args: P) => Promise<object>
    R extends object
> {
    protected apiKey: string;
    protected baseUrl: string;

    /**
     * We store the tool config once to avoid repeated lookups.
     */
    protected toolConfig: ReturnType<typeof getToolConfig>;

    /**
     * The function returned by `initGetAdsFunction`.
     * Subclasses will define the actual payload `P` and return type `R`.
     */
    protected fn: (args: P) => Promise<R>;

    /**
     * @param args - (apiKey, baseUrl) override or environment-based config.
     * @param toolName - The name of the tool to retrieve from your `tools` config.
     * @param isBanner - Pass `true` if retrieving Banner Ads; `false` for Chat Ads.
     */
    constructor(
        args: { apiKey?: string; baseUrl?: string },
        toolName: string,
        isBanner: boolean
    ) {
        // Resolve API key from args or environment variable
        this.apiKey = getConfigValue(args, 'apiKey', 'ADS4GPTS_API_KEY');

        // Resolve base URL (defaults to 'https://with.ads4gpts.com')
        this.baseUrl = args.baseUrl || 'https://with.ads4gpts.com';

        // Retrieve the tool config
        this.toolConfig = getToolConfig(toolName);

        // Initialize the ads-fetching function
        // The cast matches the generics <P, R>
        this.fn = initGetAdsFunction(
            this.apiKey,
            this.baseUrl,
            this.toolConfig.url,
            isBanner
        ) as unknown as (args: P) => Promise<R>;
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
    public getTool(chatCompletionMethod: 'stream'): ChatCompletionTool[];
    public getTool(
        chatCompletionMethod: 'run-tool'
    ): RunnableToolFunctionWithParse<P>[];
    public getTool(
        chatCompletionMethod: 'stream' | 'run-tool'
    ): ChatCompletionTool[] | RunnableToolFunctionWithParse<P>[] {
        // Build a zodFunction *with the same type parameters*
        const toolFunction = zodFunction<P>({
            function: this.fn,
            schema: this.toolConfig.parameters as unknown as ZodType<P>,
            description: this.toolConfig.description,
            name: this.toolConfig.name,
        });

        if (chatCompletionMethod === 'stream') {
            // Return as ChatCompletionTool[]
            return [toolFunction as unknown as ChatCompletionTool];
        } else {
            // Return as RunnableToolFunctionWithParse<P>[]
            return [
                toolFunction as unknown as RunnableToolFunctionWithParse<P>,
            ];
        }
    }

    /**
     * Directly execute the underlying function without going through getTool().
     * This uses the fully typed `(args: P) => Promise<R>`.
     */
    public async execute(args: P): Promise<R> {
        return this.fn(args);
    }
}
