import { ChatOpenAI } from '@langchain/openai';
import { getConfigValue } from './lib/utils';
import ADS4GPTsToolkit from './toolkit';
import promptTemplate from './lib/prompts/ads4GPTsAgentPrompt';
import { AgentOptions } from './types/ads4GPTsAgent';
/**
 * Initializes and returns an ADS4GPTs agent configured with tools and prompts.
 *
 * @param args - A record of input arguments for configuration.
 * @param args.openai_api_key - (Optional) OpenAI API key used for initializing the ChatOpenAI model.
 *                              If not provided, it will attempt to retrieve the value from the `OPENAI_API_KEY` environment variable.
 * @param args.ads4gpts_api_key - (Optional) Ads4GPTs API key used for initializing the toolkit.
 *                                If not provided, it will attempt to retrieve the value from the `ADS4GPTS_API_KEY` environment variable.
 *
 * @returns An initialized ADS4GPTs agent ready for use, with tools and prompts configured.
 *
 * @throws Error if either `openai_api_key` or `ads4gpts_api_key` is not provided in the arguments or environment variables.
 *
 * @example
 * // Example usage with explicit API keys
 * const agent = await getADS4GPTsAgent({
 *     openai_api_key: 'sk-openai-12345',
 *     ads4gpts_api_key: 'sk-ads4gpts-67890',
 * });
 *
 * @example
 * // Example usage with API keys from environment variables
 * const agent = await getADS4GPTsAgent();
 */
export async function getADS4GPTsAgent(args: AgentOptions = {}) {
    try {
        const openaiApiKey = getConfigValue(
            args,
            'openai_api_key',
            'OPENAI_API_KEY'
        );
        const ads4gptsApiKey = getConfigValue(
            args,
            'ads4gpts_api_key',
            'ADS4GPTS_API_KEY'
        );

        const model = new ChatOpenAI({
            model: 'gpt-4o',
            temperature: 0.2,
            apiKey: openaiApiKey,
        });
        console.info(
            'ChatOpenAI model for ADS4GPTs agent initialized successfully.'
        );

        const ads4gptsToolkit = new ADS4GPTsToolkit({ apiKey: ads4gptsApiKey });
        const agentTools = ads4gptsToolkit.getTools();
        console.info('ADS4GPTsToolkit initialized and tools retrieved.');

        const agent = promptTemplate.pipe(model.bindTools(agentTools));

        console.info('Ads4GPTs agent created successfully.');

        return agent;
    } catch (error: any) {
        console.error(`Error initializing ADS4GPTs agent: ${error.message}`);
        throw error;
    }
}
