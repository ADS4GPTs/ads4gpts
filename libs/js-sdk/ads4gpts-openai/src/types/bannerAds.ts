/**
 * Types & interfaces for the Ads4GPTs Banner Ads.
 */

import { z } from 'zod';
import { BannerAdsInputSchema } from '../schemas/bannerAds';

export type BannerAdsPayload = z.infer<typeof BannerAdsInputSchema>;

export interface BannerAdData {
    ad_creative: string;
    ad_title: string;
    ad_body: string;
    ad_link: string;
    ad_link_cta: string;
}

export interface BannerAdsResponse {
    status: 'success' | 'error';
    data?: {
        ads: BannerAdData | BannerAdData[];
    };
    message?: string;
}
