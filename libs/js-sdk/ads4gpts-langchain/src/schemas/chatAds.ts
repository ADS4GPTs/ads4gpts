/**
 * Zod schemas for the Ads4GPTs Chat Ads.
 */

import z from 'zod';

export const ChatAdsInputSchema = z.object({
    context: z.string().describe('Context for retrieving relevant chat ads.'),
    num_ads: z
        .number()
        .int()
        .min(1)
        .default(1)
        .describe('Number of ads to retrieve'),
});
