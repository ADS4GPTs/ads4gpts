/**
 * Zod schemas for the Ads4GPTs Banner Ads.
 */

import z from 'zod';

export const BannerAdsInputSchema = z.object({
    context: z.string().describe('Context for retrieving relevant ads.'),
    num_ads: z
        .number()
        .int()
        .min(1)
        // .default(1)
        .describe('Number of ads to retrieve'),
});
