import { tool } from 'ai';
import { z } from 'zod';
import { AdData, AdsResponse } from '../types/adTypes';

/**
 * Retrieve the API key from environment variables once at module load time.
 * Fail fast if not found.
 */
const ADS4GPTS_API_KEY: string = (() => {
    const apiKey = process.env.ADS4GPTS_API_KEY;
    if (!apiKey) {
        throw new Error('Missing ADS4GPTS_API_KEY environment variable.');
    }
    return apiKey;
})();

/**
 * Fetch with retry logic. Throws on persistent failure.
 * @param url URL to POST to
 * @param options RequestInit options (body, headers, etc.)
 * @param maxRetries number of attempts before giving up
 * @param backoffFactor multiplier for exponential backoff
 */
async function fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 5,
    backoffFactor = 0.2
): Promise<AdsResponse> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, { ...options });
            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status} ${response.statusText}`
                );
            }
            const json = (await response.json()) as AdsResponse;
            return json;
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : String(err);
            console.error(
                `Fetch attempt ${attempt}/${maxRetries} failed: ${errorMessage}`
            );

            if (attempt === maxRetries) {
                throw new Error(
                    `Failed to fetch after ${maxRetries} attempts: ${errorMessage}`
                );
            }

            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    backoffFactor * Math.pow(2, attempt - 1) * 1000
                )
            );
        }
    }
    // Should never reach here due to throws
    throw new Error('Unexpected error in fetchWithRetry.');
}

const Ads4GPTsBaseInputSchema = z.object({
    context: z.string().describe('Context for retrieving relevant ads.'),
    num_ads: z
        .number()
        .int()
        .min(1)
        .default(1)
        .describe('Number of ads to retrieve'),
});

interface AdsPayload {
    context: string;
    num_ads: number;
}

/**
 * Retrieves ads from the ads API endpoint.
 * Throws an error if unable to retrieve ads or if the response is malformed.
 * @param endpoint The API endpoint (e.g., "/api/v1/banner_ads")
 * @param payload The request payload (context, num_ads)
 */
async function getAds(
    endpoint: string,
    payload: AdsPayload
): Promise<AdData | AdData[]> {
    const baseUrl = 'https://ads-api-fp3g.onrender.com';
    const url = `${baseUrl}${endpoint}`;
    const headers = {
        Authorization: `Bearer ${ADS4GPTS_API_KEY}`,
        'Content-Type': 'application/json',
    };

    const responseJson = await fetchWithRetry(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    const adsData = responseJson?.data?.ads;
    if (!adsData) {
        throw new Error("Invalid response: no 'ads' field found.");
    }

    if (Array.isArray(adsData)) {
        return payload.num_ads > 1 ? adsData : adsData[0];
    } else {
        // Single ad object
        return adsData;
    }
}

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
    parameters: Ads4GPTsBaseInputSchema,
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
    parameters: Ads4GPTsBaseInputSchema,
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

import type { CoreTool } from 'ai';
// import { ads4gptsBannerTool, ads4gptsChatTool } from './tools';

class Ads4GPTsToolkit {
    /**
     * Returns an object containing the Ads4GPTs tools.
     * This method is now static, so it can be called directly on the class
     * without needing to instantiate it.
     */
    static getTools(): { [key: string]: CoreTool } {
        return {
            ads4gpts_banner_tool: ads4gptsBannerTool,
            ads4gpts_chat_tool: ads4gptsChatTool,
        };
    }
}

export default Ads4GPTsToolkit;
