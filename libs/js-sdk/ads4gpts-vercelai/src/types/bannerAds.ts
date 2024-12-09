/**
 * Types & interfaces for the Ads4GPTs Banner Ads.
 */

import { z } from 'zod';
import { BannerAdsInputSchema } from '../schemas/bannerAds';

export type BannerAdsPayload = z.infer<typeof BannerAdsInputSchema>;

export interface BannerAdData {
    creative: string;
    header: string;
    copy: string;
    cta_link: string;
}

export interface BannerAdsResponse {
    status: 'success' | 'error';
    data?: {
        ads: BannerAdData | BannerAdData[];
    };
    message?: string;
}
