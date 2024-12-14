/**
 * Types & interfaces for the Ads4GPTs Chat Ads.
 */

import { z } from 'zod';
import { ChatAdsInputSchema } from '../schemas/chatAds';

export type ChatAdsPayload = z.infer<typeof ChatAdsInputSchema>;

export interface ChatAdData {
    ad_text: string;
}

export interface ChatAdsResponse {
    status: 'success' | 'error';
    data?: {
        ads: ChatAdData | ChatAdData[];
    };
    message?: string;
}
