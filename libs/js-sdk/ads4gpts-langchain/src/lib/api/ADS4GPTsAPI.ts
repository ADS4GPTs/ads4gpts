import { BannerAdsPayload } from '../../types/bannerAds';
import { ChatAdsPayload } from '../../types/chatAds';
import { fetchWithRetry } from '../utils';

export class ADS4GPTsAPI {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string) {
        this.apiKey =
            apiKey ||
            process.env.ADS4GPTS_API_KEY ||
            (() => {
                throw new Error(
                    'ads4gpts_api_key is required. Provide it or set ADS4GPTS_API_KEY in env.'
                );
            })();
        this.baseUrl = 'https://with.ads4gpts.com';
    }

    async run(
        method: string,
        arg: BannerAdsPayload | ChatAdsPayload
    ): Promise<string> {
        const url = `${this.baseUrl}${method}`;
        const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        try {
            // arg is expected to conform to the tool’s schema (context, num_ads)
            const response = await fetchWithRetry(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(arg),
            });

            // The response should be BannerAdsResponse or ChatAdsResponse
            if (response && response.data) {
                const ads = response.data.ads;

                return JSON.stringify(ads);
            }

            // If no Ads are found, return a relevant message
            return 'No Ads found';
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : JSON.stringify(error);
            return `Error fetching ads: ${errorMessage}`;
        }
    }
}
