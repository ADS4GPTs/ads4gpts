import { tool } from 'ai';
import { BannerAdsInputSchema } from './schemas/bannerAds';
import { ChatAdsInputSchema } from './schemas/chatAds';
import { getAds } from './utils';
import { ADS4GPTS_API_KEY } from './config';

/**
 * Tool for retrieving Banner Ads.
 */
export const ads4gptsBannerTool = tool({
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
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            console.error(`Error retrieving banner ads: ${message}`);
            throw new Error(`ads4gpts_banner_tool failed: ${message}`);
        }
    },
});

/**
 * Tool for retrieving Chat Ads.
 */
export const ads4gptsChatTool = tool({
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
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            console.error(`Error retrieving chat ads: ${message}`);
            throw new Error(`ads4gpts_chat_tool failed: ${message}`);
        }
    },
});
