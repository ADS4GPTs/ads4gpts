/**
 * Types and interfaces for the Ads4GPTs responses.
 */

export interface AdData {
    // Shape of a single ad object, adjust fields to match actual API response
    creative?: string;
    header?: string;
    copy?: string;
    cta_link?: string;
    text?: string; // for chat ads
    // Add other fields as returned by your API
}

export interface AdsResponse {
    data?: {
        ads?: AdData | AdData[];
    };
}
