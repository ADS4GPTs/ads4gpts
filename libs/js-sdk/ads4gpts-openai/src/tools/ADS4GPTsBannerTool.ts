import { BannerAdData, BannerAdsPayload } from '../types/bannerAds';

// Banner tool
import { ADS4GPTsTool } from './ADS4GPTsTool';

export class ADS4GPTsBannerTool extends ADS4GPTsTool<
    BannerAdsPayload,
    BannerAdData | BannerAdData[]
> {
    constructor(args: { apiKey?: string; baseUrl?: string } = {}) {
        super(args, 'ads4gpts_banner_tool', true);
    }
}
