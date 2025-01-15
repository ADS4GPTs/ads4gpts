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
     * Tool specific configuration parameters.
     */
    protected toolConfig: ReturnType<typeof getToolConfig>;

    /**
     * The function returned by `initGetAdsFunction`.
     * Subclasses will define the actual payload `P` and return type `R`.
     */
    protected fn: (args: P) => Promise<R>;

    /**
     *
     * @param args - (apiKey, baseUrl) override or environment-based config.
     * @param args.apiKey - (optional) The ADS4GPTs API key to use for the tool.
     * You can either pass it as an argument or set it as an environment variable.
     * @param args.baseUrl - (optional) The base URL for the ADS4GPTs API service. It
     * defaults to the ADS4GPTS API URL.
     * @param toolName - The name of the tool to retrieve from your `tools` config.
     */
    constructor(args: { apiKey?: string; baseUrl?: string }, toolName: string) {
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
            this.toolConfig.url
        ) as unknown as (args: P) => Promise<R>;
    }

    /**
     * Overloads to ensure correct inference of return type based on `chatCompletionMethod` value.
     */

    /**
     * Returns an **array** with the corresponding tool for use in OpenAI Chat Completion.
     * The chatCompletionMethod parameter specifies the correct tool type depending on
     * the chat completion method used.
     *
     * @param chatCompletionMethod - Use the value 'stream' for tools used with create() and stream() chat completion
     * methods or the value 'run-tool' for tools used with runTools() chat completion method.
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
     * Directly execute the tool's function.
     * @param args - The arguments for the tool's function.
     * @returns The result of the tool's execution.
     */
    public async execute(args: P): Promise<R> {
        return this.fn(args);
    }
}
