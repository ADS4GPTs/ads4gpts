/**
 *  Helper functions for the Ads4GPTs OpenAI SDK toolkit.
 */

import { ZodSchema } from 'zod';
import {
    BannerAdData,
    BannerAdsPayload,
    BannerAdsResponse,
} from '../types/bannerAds';
import { ChatAdData, ChatAdsPayload, ChatAdsResponse } from '../types/chatAds';
import { RunnableToolFunctionWithParse } from 'openai/lib/RunnableFunction.mjs';
import zodToJsonSchema from 'zod-to-json-schema';
import { JSONSchema } from 'openai/lib/jsonschema';
import OpenAI from 'openai';
import tools from './config/toolsConfig';

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

/**
 * Returns a function that retrieves ads from the specified ads API endpoint.
 *
 * @param apiKey - The API key for authorization.
 * @param baseUrl - The base URL of the ads server.
 * @param endpoint - The specific API endpoint (e.g., '/api/v1/banner_ads').
 * @param isBanner - Pass `true` if retrieving Banner Ads; `false` for Chat Ads.
 * @returns An asynchronous function that, given a context and an optional number of ads,
 *          returns matching ads from the specified endpoint.
 */
export function initGetAdsFunction(
    apiKey: string,
    baseUrl: string,
    endpoint: string,
    isBanner = true
) {
    /**
     * Retrieves ads from the configured API endpoint.
     *
     * @param context - The context for retrieving relevant ads.
     * @param num_ads - The number of ads to retrieve.
     * @returns A single ad object, or an array of ads, depending on the value of `num_ads`.
     * @throws Will throw an error if the response is invalid or if the ads returned
     *         do not match the expected banner/chat format.
     */
    return async function getAds({
        context,
        num_ads,
    }: BannerAdsPayload | ChatAdsPayload): Promise<
        BannerAdData | BannerAdData[] | ChatAdData | ChatAdData[]
    > {
        const url = `${baseUrl}${endpoint}`;
        const headers = {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };

        const responseJson = await fetchWithRetry(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ context, num_ads }),
        });

        const adsData = responseJson?.data?.ads;
        if (!adsData) {
            throw new Error("Invalid response: no 'ads' field found.");
        }

        if (Array.isArray(adsData)) {
            // If an array is returned, decide whether to return just the first ad or the entire array
            return num_ads > 1 ? adsData : adsData[0];
        }
        // Single object
        return adsData;
    };
}

/**
 * A generic utility function that returns a RunnableFunction
 * you can pass to `.runTools()`,
 * with a fully validated, typesafe parameters schema.
 */
export function zodFunction<T extends object>({
    function: fn,
    schema,
    description = '',
    name,
}: {
    function: (args: T) => Promise<object>;
    schema: ZodSchema<T>;
    description: string;
    name: string;
}):
    | RunnableToolFunctionWithParse<T>
    | OpenAI.Chat.Completions.ChatCompletionTool[] {
    return {
        type: 'function',
        function: {
            function: fn,
            name: name ?? fn.name,
            description: description,
            parameters: zodToJsonSchema(schema) as JSONSchema,
            parse(input: string): T {
                const obj = JSON.parse(input);
                return schema.parse(obj);
            },
        },
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

/**
 * A helper function to retrieve a specific tool config by name.
 * @param toolName The name of the tool to search for.
 * @returns The matching tool configuration if found, otherwise throws an error.
 */
export function getToolConfig(toolName: string) {
    const toolConfig = tools.find((tool) => tool.name === toolName);
    if (!toolConfig) {
        throw new Error(`Tool configuration for '${toolName}' not found.`);
    }
    return toolConfig;
}
