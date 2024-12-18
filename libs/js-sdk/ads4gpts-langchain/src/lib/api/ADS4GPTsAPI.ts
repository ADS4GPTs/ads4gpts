import { BannerAdData, BannerAdsPayload } from '../../types/bannerAds';
import { ChatAdData, ChatAdsPayload } from '../../types/chatAds';
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
    ): Promise<
        | BannerAdData
        | ChatAdData
        | BannerAdData[]
        | ChatAdData[]
        | { error: string }
    > {
        const url = `${this.baseUrl}${method}`;
        const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        // arg is expected to conform to the tool’s schema (context, num_ads)
        const response = await fetchWithRetry(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(arg),
        });

        // The response should be BannerAdsResponse or ChatAdsResponse
        if (response && response.data) {
            const ads = response.data.ads;
            const numAds = arg.num_ads ?? 1;

            if (Array.isArray(ads)) {
                return numAds > 1 ? ads : ads[0];
            } else {
                return ads; // single object
            }
        }

        // If no data.ads found, return an error
        return { error: 'No ads found in response.' };
    }
}
