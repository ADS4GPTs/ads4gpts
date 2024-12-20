/**
 *  Helper functions for the Ads4GPTs Langchain JS Toolkit.
 */

import {
    BannerAdData,
    BannerAdsPayload,
    BannerAdsResponse,
} from '../types/bannerAds';
import { ChatAdData, ChatAdsPayload, ChatAdsResponse } from '../types/chatAds';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Fetch with retry logic. Throws on persistent failure.
 * @param url URL to POST to
 * @param options RequestInit options (body, headers, etc.)
 * @param maxRetries number of attempts before giving up
 * @param backoffFactor multiplier for exponential backoff
 */
export async function fetchWithRetry(
    url: string,
    options: RequestInit,
    maxRetries = 5,
    backoffFactor = 0.2
): Promise<BannerAdsResponse | ChatAdsResponse> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, { ...options });

            if (!response) {
                throw new Error(
                    'No response received from server. Request failed.'
                );
            }

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status} ${response.statusText}`
                );
            }
            const json = (await response.json()) as
                | BannerAdsResponse
                | ChatAdsResponse;
            return json;
        } catch (err: any) {
            const errorMessage = err.message;

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

export function initGetAdsFunction(apiKey: string) {
    /**
     * Retrieves ads from the ads API endpoint.
     * Throws an error if unable to retrieve ads or if the response is malformed.
     * @param endpoint The API endpoint (e.g., "/api/v1/banner_ads")
     * @param payload The request payload (context, num_ads)
     */
    return async function getAds(
        endpoint: string,
        payload: BannerAdsPayload | ChatAdsPayload
    ): Promise<BannerAdData | BannerAdData[] | ChatAdData | ChatAdData[]> {
        const baseUrl = 'https://with.ads4gpts.com';
        const url = `${baseUrl}${endpoint}`;
        const headers = {
            Authorization: `Bearer ${apiKey}`,
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
    };
}

/**
 * Retrieves a configuration value from the provided arguments or environment variables.
 *
 * @param args - A record of key-value pairs, typically the input arguments.
 * @param key - The key to look for in the `args` object.
 * @param envKey - The environment variable key to check if the value is not in `args`.
 * @returns The value of the key from `args` or the corresponding environment variable.
 * @throws Error if the key is not found in `args` or the environment.
 */
export function getConfigValue(
    args: Record<string, any>,
    key: string,
    envKey: string
): string {
    if (args[key]) {
        return args[key];
    } else if (process.env[envKey]) {
        return process.env[envKey] as string;
    } else {
        throw new Error(
            `Missing required key: ${key}. Please provide it in options or set ${envKey} in environment.`
        );
    }
}
