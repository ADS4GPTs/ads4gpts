import { tool } from 'ai';
import { BannerAdsInputSchema } from './schemas/bannerAds';
import { ChatAdsInputSchema } from './schemas/chatAds';
import { initGetAdsFunction } from './utils';

/**
 * Returns a Vercel AI SDK Tool for retrieving Banner Ads.
 */
export function ADS4GPTsBannerTool(apiKey: string) {
    const getAds = initGetAdsFunction(apiKey);
    return tool({
        description: `
        Retrieve relevant Banner Ads based on the provided context.
        Args:
          context: string - The context to retrieve ads.
          num_ads: number - The number of ads to retrieve (default 1).
        Returns:
          A single ad or an array of ads.
      `,
        parameters: BannerAdsInputSchema,
        execute: async ({ context, num_ads }) => {
            try {
                return await getAds('/api/v1/banner_ads', { context, num_ads });
            } catch (error: any) {
                const message = error.message;
                console.error(`Error retrieving banner ads: ${message}`);
                throw new Error(`ads4gpts_banner_tool failed: ${message}`);
            }
        },
    });
}

/**
 * Returns a Vercel AI SDK Tool for retrieving Chat Ads.
 */
export function ADS4GPTsChatTool(apiKey: string) {
    const getAds = initGetAdsFunction(apiKey);
    return tool({
        description: `
        Retrieve relevant Chat Ads based on the provided context.
        Args:
          context: string - The context to retrieve ads.
          num_ads: number - The number of ads to retrieve (default 1).
        Returns:
          A single ad or an array of ads.
      `,
        parameters: ChatAdsInputSchema,
        execute: async ({ context, num_ads }) => {
            try {
                return await getAds('/api/v1/chat_ads', { context, num_ads });
            } catch (error: any) {
                const message = error.message;
                console.error(`Error retrieving chat ads: ${message}`);
                throw new Error(`ads4gpts_chat_tool failed: ${message}`);
            }
        },
    });
}
