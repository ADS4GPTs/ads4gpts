import { BannerAdData, BannerAdsPayload } from '../types/bannerAds';

// Banner tool
import { ADS4GPTsTool } from './ADS4GPTsTool';

export class ADS4GPTsBannerTool extends ADS4GPTsTool<
    BannerAdsPayload,
    BannerAdData | BannerAdData[]
> {
    /**
     *
     * @param args - (apiKey, baseUrl) override or environment-based config.
     * @param args.apiKey - (optional) The ADS4GPTs API key to use for the tool.
     * You can either pass it as an argument or set it as an environment variable.
     * @param args.baseUrl - (optional) The base URL for the ADS4GPTs API service. It
     * defaults to the ADS4GPTS API URL.
     */
    constructor(args: { apiKey?: string; baseUrl?: string } = {}) {
        super(args, 'ads4gpts_banner_tool');
    }
}
